import React, {useEffect, useState, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AuthStack} from './Stack';
import BottomTab from './BottomTab';
import {setLoginStatus} from '../redux/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ActivityIndicator,
  View,
  Platform,
  Alert,
  Dimensions,
  AppState,
} from 'react-native';
import {appColors} from '../utilities/appColors';
import {setLicenseUpdate} from '../redux/globalUseSlice';
import {useNavigation} from '@react-navigation/native';
import messaging,{} from '@react-native-firebase/messaging';
import {setInfoContentTrigger} from '../redux/globalUseSlice';
import {setNotifeeTrigger} from '../redux/globalUseSlice';
import {useNetInfo} from '@react-native-community/netinfo';
import * as Animatable from 'react-native-animatable';
import {appFont} from '../utilities/appFonts';
import {fontScalling} from '../utilities/HelpeFunction';
import LottieView from 'lottie-react-native';
import {black} from 'react-native-paper/lib/typescript/styles/themes/v2/colors';

const {width, height} = Dimensions.get('screen');

export default function MainStack() {
  const {isConnected} = useNetInfo();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const {loginStatus, isLoggedIn} = useSelector(state => state.auth);
  const {infoContentTrigger} = useSelector(state => state.globalUse);
  const navigation = useNavigation();
  const appState = useRef(AppState.currentState);

  const infoContentTriggerRef = useRef(0);
  const notifeeTriggerRef = useRef(0); // Using useRef for notifeeTrigger value

  //foreground background and quit state handling
  useEffect(() => {
    const requestPermission = async () => {
      if (Platform.OS === 'ios' || 'android') {
        await messaging().requestPermission();
      }
    };
    // console.log(JSON.stringify(messaging(), undefined, 2), 'messaging');

    const registerBackgroundHandler = () => {
      messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log(remoteMessage, 'remoteMessage0');
      });
    };
    requestPermission();
    registerBackgroundHandler();
  }, []);

  useEffect(() => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(JSON.stringify(remoteMessage, undefined, 2), 'remotess1');
      navigation.navigate('notification');
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(JSON.stringify(remoteMessage, undefined, 2), 'remote2');
          navigation.navigate('notification');
        }
      });
  }, []);

  // foreground message
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log(remoteMessage, 'remoteMessage');
      notifeeTriggerRef.current += 1;
      infoContentTriggerRef.current += 1;
      dispatch(setNotifeeTrigger(notifeeTriggerRef.current));
      dispatch(setInfoContentTrigger(infoContentTriggerRef.current));
    });
    return unsubscribe;
  }, []);

  // appState trigger to bell count:
  useEffect(() => {
    AppState.addEventListener('change', nextAppState => {
      if (nextAppState == 'active') {
        dispatch(setInfoContentTrigger(infoContentTrigger + 1));
      }
    });
  }, [appState.current]);

  useEffect(() => {
    // Load login status from AsyncStorage when the component mounts
    const loadLoginStatus = async () => {
      try {
        await AsyncStorage.getItem('loginStatus').then(status => {
          if (status) {
            dispatch(setLoginStatus(JSON.parse(status)));
            setLoading(false);
          }
        });
        await AsyncStorage.getItem('licenseUpload').then(data => {
          if (data) {
            dispatch(setLicenseUpdate(JSON.parse(data)));
            setLoading(false);
          }
        });
        setLoading(false);
      } catch (error) {
        console.error('Error loading login status from AsyncStorage:', error);
      }
    };

    loadLoginStatus();
  }, [isLoggedIn, loginStatus]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: appColors.screenBg,
        }}>
        <ActivityIndicator size={'large'} color={appColors.themeRed} />
      </View>
    );
  }
  return (
    <>
      {isConnected ? (
        loginStatus ? (
          <>
            <BottomTab />
          </>
        ) : (
          <>
            <AuthStack />
          </>
        )
      ) : (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: appColors.textBlack,
          }}>
          {/* <Animatable.Image
            duration={500}
            iterationDelay={550}
            animation={'fadeIn'}
            iterationCount={'infinite'}
            isInteraction={true}
            resizeMode="contain"
            style={{
              width: width / 2,
              height: height / 3,
            }}
            source={require('../../assets/Images/lottieView/petrol.json')}
          /> */}
          <LottieView
            style={{
              width: width,
              height: height / 3,
              backgroundColor: appColors.textBlack,
            }}
            loop={true}
            autoPlay={true}
            resizeMode="contain"
            source={require('../../assets/Images/lottieView/petrol.json')}
          />
          <Animatable.Text
            duration={1000}
            animation={'zoomIn'}
            style={{
              fontFamily: appFont.Lato_Bold,
              color: appColors.textWhite,
              fontSize: fontScalling(2),
              textAlign: 'center',
              marginTop: 15,
            }}>
            Controleer uw internetverbinding en probeer het opnieuw
          </Animatable.Text>
        </View>
      )}
    </>
  );
}
