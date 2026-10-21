import React, {useEffect, useRef, useState} from 'react';
import {Platform, Linking, Alert, Text, View, AppState} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import MainStack from './src/navigation/MainStack';
import SplashScreen from 'react-native-splash-screen';
import {url} from './src/utilities/appApi';
import {useSelector, useDispatch} from 'react-redux';
import {
  setInfoContent,
  setSliderContent,
  setFcmToken,
  setUserAgent,
  setUpdateNeeded,
} from './src/redux/SettingSlice';
import messaging from '@react-native-firebase/messaging';
import {
  checkNotifications,
  requestNotifications,
} from 'react-native-permissions';
import {ToastProvider} from 'react-native-toast-notifications';
import {appFont} from './src/utilities/appFonts';
import {appColors} from './src/utilities/appColors';
import UserAgent from 'react-native-user-agent';
import VersionCheck from 'react-native-version-check';
import VersionUpdate from './src/screens/main/VersionUpdate';
import {setInfoContentTrigger} from './src/redux/globalUseSlice';
import { print } from './src/utilities/HelpeFunction';

function App() {
  const dispatch = useDispatch();
  const {fcmToken, userAgent, infoContent, updateNeeded} = useSelector(
    state => state.settings,
  );
  const {infoContentTrigger} = useSelector(state => state.globalUse);

  const [currentVersion, setCurrentVersion] = useState('');
  const [latestVersion, setLatestVersion] = useState('');
  const [appUrl, setAppUrl] = useState('');
  const appState = useRef(AppState.currentState);

  // version check:
  useEffect(() => {
    // Get current app version
    const currentAppVersion = VersionCheck.getCurrentVersion();
    setCurrentVersion(currentAppVersion);

    // Get the latest app version
    VersionCheck.getLatestVersion({
      provider: 'playStore', // or 'playStore' 'playStore'
    })
      .then(latestVersion => {
        setLatestVersion(latestVersion);
        console.log(latestVersion, 'latestVersion');
        console.log(currentAppVersion, 'currentAppVersion');
      })
      .catch(err => {
        console.log(err);
      });

    // get the appUrl:
    VersionCheck.needUpdate({provider: 'playStore'}).then(async res => {
      setAppUrl(res.storeUrl);
      // console.log(res.storeUrl);
    });
  }, []);

  // permission check:
  useEffect(() => {
    (async () => {
      const ua = UserAgent.getUserAgent();
      if (ua) {
        dispatch(setUserAgent(ua));
      }
    })();
  }, []);

  useEffect(() => {
    if (userAgent && userAgent != '') {
      const requestNotificationPermissions = async () => {
        checkNotifications().then(({status}) => {
          if (status !== 'granted') {
            requestNotifications(['alert', 'sound', 'badge']).then(
              ({status}) => {
                if (status !== 'granted') {
                  Alert.alert(
                    'Notification Permission Blocked',
                    'Please enable notification permissions in the app settings to receive notifications.',
                    [
                      {
                        text: 'Deny',
                        onPress: () => {},
                      },
                      {
                        text: 'Go to Settings',
                        onPress: () => {
                          Linking.openSettings();
                        },
                      },
                    ],
                  );
                } else {
                  checkPermission();
                }
              },
            );
          } else {
            checkPermission();
          }
        });
      };

      const checkPermission = () => {
        messaging()
          .hasPermission()
          .then(enabled => {
            if (enabled) {
              getToken();
            } else {
              requestPermission();
            }
          })
          .catch(error => {
            console.log('error checking permisions ' + error);
          });
      };

      const requestPermission = () => {
        messaging()
          .requestPermission()
          .then(() => {
            getToken();
          })
          .catch(error => {
            console.log('permission rejected ' + error);
          });
      };

      const getToken = async () => {
        messaging()
          .getToken()
          .then(token => {
            if (token != null) {
              dispatch(setFcmToken(token));
              initApi(token);
              console.log(token, 'fcmToken');
            }
          })
          .catch(error => {
            console.log('error getting push token ' + error);
          });
      };

      requestNotificationPermissions();
    }
  }, [userAgent]);
  // init
  const initApi = async fcm => {
    // print(fcm, 'deviceid');

    if (userAgent && userAgent != '') {
      try {
        const headers = new Headers();
        const formData = new FormData();
        headers.append('User-Agent', userAgent);

        formData.append('device_name', Platform.OS);
        formData.append('deviceid', fcm);
        // console.log(VersionCheck.getCurrentVersion(), 'version');
        formData.append('current_version', VersionCheck.getCurrentVersion());
        const response = await fetch(url().deviceID, {
          method: 'POST',
          body: formData,
          headers: headers,
        });

        // console.log(JSON.stringify(headers, undefined, 4), 'init head');
        if (response.status == 200) {
          const resparse = await response.json();
          if (resparse.data) {
            // console.log(resparse, 'init');
            dispatch(setUpdateNeeded(resparse.data.status_check));
          }
        } else {
          console.log('init status code:', response.status);
        }
      } catch (error) {
        console.log(error, 'error-init');
      }
    }
  };

  // intro slider
  useEffect(() => {
    if (userAgent && userAgent != '') {
      (async () => {
        try {
          const headers = new Headers();

          headers.append('User-Agent', userAgent);

          const response = await fetch(url().introSlider, {
            method: 'POST',
            headers: headers,
          });

          if (response.status == 200) {
            const resparse = await response.json();

            if (resparse.data) {
              // console.log(JSON.stringify(resparse.data, undefined, 4), 'intro');
              dispatch(setSliderContent(resparse.data.intro_slider));
              dispatch(setUpdateNeeded(resparse.data.status_check));
              SplashScreen.hide();
            } else {
              console.log('empty intro slide data');
              SplashScreen.hide();
            }
          } else {
            console.log('intro slider status code:', response.status);
            SplashScreen.hide();
          }
        } catch (error) {
          console.log(error, 'error-catchedintro slider ');
        }
      })();
    }
  }, [userAgent]);

  // info
  useEffect(() => {
    if (userAgent && userAgent != '' && fcmToken && fcmToken != '') {
      (async () => {
        try {
          const headers = new Headers();
          const formData = new FormData();

          headers.append('User-Agent', userAgent);
          formData.append('deviceid', fcmToken);

          const response = await fetch(url().infoContent, {
            method: 'POST',
            body: formData,
            headers: headers,
          });

          if (response.status == 200) {
            const resparse = await response.json();
            console.log(
              JSON.stringify(resparse.data.notify_count, undefined, 4),
              'info',
            );
            if (resparse.data) {
              dispatch(setInfoContent(resparse.data));
              dispatch(setUpdateNeeded(resparse.data.status_check));
              // console.log(JSON.stringify(resparse.data,undefined,4),'info cc');
            } else {
              console.log('empty info data');
            }
          } else {
            console.log('info status code:', response.status);
          }
        } catch (error) {
          console.log(error, 'info error');
        }
      })();
    }
  }, [fcmToken, infoContentTrigger, userAgent]);

  // console.log(infoContentTrigger, 'infoContentTrigger');

  // 12/09/2024
  // const budgeCountApi = () => {
  //   (async () => {
  //     try {
  //       const headers = new Headers();
  //       const formData = new FormData();

  //       headers.append('User-Agent', userAgent);
  //       formData.append('deviceid', fcmToken);

  //       const response = await fetch(url().notifyCount, {
  //         method: 'POST',
  //         body: formData,
  //         headers: headers,
  //       });

  //       if (response.status == 200) {
  //         const resparse = await response.json();
  //         // console.log(JSON.stringify(resparse.data, undefined, 4), 'info');
  //         if (resparse.data) {
  //           // console.log(JSON.stringify(resparse.data,undefined,4),'info cc');
  //         } else {
  //           console.log('empty info data');
  //         }
  //       } else {
  //         console.log('info status code:', response.status);
  //       }
  //     } catch (error) {
  //       console.log(error, 'info error');
  //     }
  //   })();
  // };

  // useEffect(() => {
  //   budgeCountApi();
  // }, []);

  const isVerSionChecker = updateNeeded
    ? currentVersion &&
      currentVersion != '' &&
      latestVersion &&
      latestVersion != '' &&
      !(currentVersion < latestVersion)
    : true;
  // console.log(isVerSionChecker, 'isversionchecker');

  return (
    <>
      <ToastProvider
        placement="bottom"
        duration={5000}
        animationType="zoom-in"
        animationDuration={250}
        normalColor="gray"
        textStyle={{
          fontFamily: appFont.Lato_Regular,
          fontSize: 15,
          color: appColors.white,
        }}
        offsetBottom={100}
        swipeEnabled={true}>
        {
          <>
            {isVerSionChecker ? (
              <NavigationContainer>
                <MainStack />
              </NavigationContainer>
            ) : (
              <>{appUrl && appUrl != '' && <VersionUpdate appUrl={appUrl} />}</>
            )}
          </>
        }
      </ToastProvider>
    </>
  );
}

export default App;
