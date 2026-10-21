import React, {useState, useEffect, useRef, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {View, Dimensions, StyleSheet} from 'react-native';
import {BottomButtons} from '../../components/Buttons/BottomButton';
import {EventInfo} from './EventInfo';
import {EventClasses} from './EventClasses';
import {EventUpdates} from './EventUpdates';
import {EventPushNotification} from './EventPushNotification';
import {AppHeader} from '../../components/AppHeader/AppHeader';
import {url} from '../../utilities/appApi';
import {useIsFocused} from '@react-navigation/native';
import {useToast} from 'react-native-toast-notifications';
import {setInfoContentTrigger} from '../../redux/globalUseSlice';
import messaging from '@react-native-firebase/messaging';
import {print} from '../../utilities/HelpeFunction';

export default function EventDetails({navigation, route}) {
  const {
    title,
    banner,
    description,
    id,
    live_url,
    event_active,
    class_active,
    textual_event,
    textual_description,
    fb,
    twitter,
    insta,
    routeSelection,
  } = route.params;

  const {fcmToken, userAgent} = useSelector(state => state.settings);
  const [selection, setSelection] = useState(
    routeSelection ? routeSelection : 1,
  );
  const [textualEvent, setTextualEvent] = useState(textual_event);
  const prevSelectRef = useRef(routeSelection ? routeSelection : 1);
  const [Updates, setUpdates] = useState([]);
  const [Updatesload, setUpdatesLoad] = useState(false);
  const [updatesRefresh, setUpdatesRefresh] = useState(false);
  const [classes, setclasses] = useState([]);
  const [classesload, setclassesLoad] = useState(false);
  const [classRefresh, setClassRefresh] = useState(false);
  const [notifi, setNotifi] = useState([]);
  const [eventActive, setEventActive] = useState(event_active);
  const [classActive, setClassActive] = useState(class_active);
  const [notifiload, setnotifiLoad] = useState(true);
  const [notifeePending, setNotifeePending] = useState(false);
  const [notifeeRefresh, setNotifeeRefresh] = useState(false);
  const {settingTrigger} = useSelector(state => state.eventSetting);
  const [prevActive, setPrevActive] = useState({
    eventActive: event_active,
    classActive: class_active,
  });
  const isFocused = useIsFocused();
  const toast = useToast();
  const dispatch = useDispatch();
  const switchSelection = select => {
    setSelection(select);
  };
  // console.log(classActive, 'classActive', eventActive);

  const {infoContentTrigger} = useSelector(state => state.globalUse);

  let headerTitle = '';
  switch (selection) {
    case 1:
      headerTitle = 'Evenementen';
      break;
    case 2:
      headerTitle = 'Documenten';
      break;
    case 3:
      headerTitle = 'Event Updates';
      break;
    case 4:
      headerTitle = 'Push instellingen';
      break;
    default:
      headerTitle = 'Evenementen'; // Default title
  }

  // classRefresh
  const onClassRefresh = useCallback(() => {
    setClassRefresh(true);
  }, []);

  // updatesRefresh
  const onUpdatesRefresh = useCallback(() => {
    setUpdatesRefresh(true);
  }, []);

  // notification refresh
  const onNotificationRefresh = useCallback(() => {
    setNotifeeRefresh(true);
  }, []);

  // eventupdate
  // Event-updates function call
  useEffect(() => {
    if (selection == 3 && Updates.length == 0) {
      eventUpdates();
    }
    if (selection == 3 && updatesRefresh) {
      eventUpdates();
    }
  }, [selection, updatesRefresh]);

  const eventUpdates = () => {
    if (userAgent && userAgent != '') {
      (async () => {
        try {
          if (Updates.length === 0 && !updatesRefresh) {
            setUpdatesLoad(true);
          }
          const headers = new Headers();
          const formData = new FormData();

          headers.append('User-Agent', userAgent);
          formData.append('event_id', id);
          const response = await fetch(url().eventUpdates, {
            method: 'POST',
            body: formData,
            headers: headers,
          });
          if (response.status == 200) {
            const resparse = await response.json();
            if (resparse.data) {
              setUpdates(resparse.data);
              setUpdatesLoad(false);
              setUpdatesRefresh(false);
            }
          } else {
            console.log(
              'error in event updates screen - status code :',
              response.status,
            );
            setUpdatesLoad(false);
            setUpdatesRefresh(false);
          }
        } catch (error) {
          setUpdatesRefresh(false);
          console.log('error occured in eventupdate');
        }
      })();
    }
  };

  // eventClasses
  // Event-classes function call
  useEffect(() => {
    if (selection == 2 && classes.length == 0) {
      eventClasses();
    }
    if (selection == 2 && classRefresh) {
      eventClasses();
    }
  }, [selection, classRefresh]);

  const eventClasses = () => {
    if (userAgent && userAgent != '') {
      (async () => {
        try {
          if (classes.length == 0 && !classRefresh) {
            setclassesLoad(true);
          }
          const headers = new Headers();
          const formData = new FormData();

          headers.append('User-Agent', userAgent);
          formData.append('event_id', id);
          const response = await fetch(url().eventClasses, {
            method: 'POST',
            body: formData,
            headers: headers,
          });
          if (response.status == 200) {
            const resparse = await response.json();
            // console.log(resparse, 'resparse.data');
            if (resparse.data) {
              setclasses(resparse.data);
              setclassesLoad(false);
              setClassRefresh(false);
            }
          } else {
            console.log('event class statusCode:', response.status);
            setclassesLoad(false);
            setClassRefresh(false);
          }
        } catch {
          console.log('error occured');
          setclassesLoad(false);
          setClassRefresh(false);
        }
      })();
    }
  };

  //eventPushNotification
  const eventPushNotification = async (trigger = false) => {
    if (fcmToken && userAgent && fcmToken != '' && userAgent != '') {
      try {
        let updated = 0;
        setNotifeePending(true);
        if (notifi.length == 0 && !notifeeRefresh) {
          setnotifiLoad(true);
        }
        const headers = new Headers();
        const formData = new FormData();

        headers.append('User-Agent', userAgent);

        formData.append('deviceid', fcmToken);
        formData.append('event_id', id);

        if (
          trigger &&
          (eventActive != prevActive.eventActive ||
            classActive != prevActive.classActive)
        ) {
          formData.append('event_active', eventActive);
          formData.append('class_active', classActive);
          updated = 1;
        }
        const response = await fetch(url().eventNotification, {
          method: 'POST',
          body: formData,
          headers: headers,
        });
        print(formData, 'formdata');
        const resparse = await response.json();
        if (resparse.status == 'success') {
          if (resparse.data) {
            // console.log(resparse.data,"data");
            setEventActive(resparse.data.active_status.event_active);
            setClassActive(resparse.data.active_status.class_active);
            console.log(
              resparse.data.active_status.event_active,
              'active',
              resparse.data.active_status.class_active,
            );
            if (!trigger || updated == 1) {
              setPrevActive({
                eventActive: resparse.data.active_status.event_active,
                classActive: resparse.data.active_status.class_active,
              });
            }
            setNotifi(resparse.data.notifications);
            // console.log(
            //   JSON.stringify(resparse.data.notifications, undefined, 2),
            //   'notifi',
            // );
            setnotifiLoad(false);
            setNotifeeRefresh(false);
            setNotifeePending(false);
          }
        } else {
          console.log('eventNotification status code :', resparse.status);
          setnotifiLoad(false);
          setNotifeeRefresh(false);
          setNotifeePending(false);
        }
      } catch (error) {
        console.log('error occured in event push notification', error);
        setnotifiLoad(false);
        setNotifeePending(false);
      }
    }
  };

  // notification redirect:
  useEffect(() => {
    if (isFocused && routeSelection) {
      switchSelection(routeSelection);
    }
  }, [isFocused]);

  // push notifi changes to trigger:
  useEffect(() => {
    if (prevSelectRef.current == 4 && !notifeePending) {
      eventPushNotification(true);
    }
    prevSelectRef.current = selection;
  }, [selection]);

  // settings update to trigger:
  useEffect(() => {
    if (settingTrigger > 0) {
      setNotifi([]);
      setEventActive('0');
      setClassActive('0');
      eventPushNotification();
    }
  }, [settingTrigger]);

  // for trigger the from routing the notification:
  useEffect(() => {
    if (!notifeePending) {
      eventPushNotification(true);
    }
  }, [selection]);

  // // unfocus & pull to refresh trigger
  // useEffect(() => {
  //   if (!isFocused && !notifeePending) {
  //     eventPushNotification(true);
  //   }

  //   if (isFocused || notifeeRefresh) {
  //     eventPushNotification(true);
  //   }
  // }, [isFocused, notifeeRefresh]);

  //  unfocus & pull to refresh trigger:
  useEffect(() => {
    if (selection == 4 && !isFocused && !notifeePending) {
      eventPushNotification(true);
    }
    if (selection == 4 && (isFocused || notifeeRefresh) && !notifeePending) {
      console.log('pull to refresh trigger');
      eventPushNotification(true);
    }
  }, [isFocused, selection, notifeeRefresh]);

  const deleteRow = rowKey => {
    const newData = [...notifi];
    const prevIndex = notifi.findIndex(item => item.id === rowKey);
    newData.splice(prevIndex, 1);
    setNotifi(newData);
  };

  // Delete Notifications
  const deleteMessage = async (mode, id = '', msgType = '') => {
    if (userAgent && userAgent != '')
      try {
        const headers = new Headers();
        const formData = new FormData();

        headers.append('User-Agent', userAgent);

        formData.append('deviceid', fcmToken);
        formData.append('mode', mode);

        if (mode == 'single') {
          formData.append('msgid', id);
          formData.append('type', msgType);
        }

        const response = await fetch(url().deleteNotification, {
          method: 'POST',
          body: formData,
          headers: headers,
        });

        if (response.status == 200) {
          const resparse = await response.json();
          if (resparse.status == 'success') {
            dispatch(setInfoContentTrigger(infoContentTrigger + 1));
            toast.hideAll();
            toast.show('succesvol verwijderd', {
              type: 'success',
              duration: 4000,
              offset: 30,
              placement: 'bottom',
              animationType: 'zoom-in',
              style: {
                marginBottom: 60,
              },
            });
          }
        } else {
          console.log('status-error');
        }
      } catch (error) {
        console.log(error, 'delete add');
      }
  };

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      setNotifi([]);
      eventPushNotification();
    });
    return unsubscribe;
  }, []);

  // mark as notifi readed:
  const markReadNotifi = async () => {
    if (fcmToken && fcmToken != '' && userAgent && userAgent != '') {
      try {
        setnotifiLoad(true);
        const headers = new Headers();
        const formdata = new FormData();

        headers.append('User-Agent', userAgent);
        formdata.append('deviceid', fcmToken);
        formdata.append('eventid', id);

        const response = await fetch(url().markAsReadedNotifi, {
          method: 'POST',
          body: formdata,
          headers: headers,
        });
        if (response.status == 200) {
          const resparse = await response.json();
          if (resparse.status == 'success') {
            // console.log(resparse, 'resparse');
            setNotifi(preData => [
              ...preData.map(data => ({...data, read_status: '1'})),
            ]);
            dispatch(setInfoContentTrigger(infoContentTrigger + 1));
            setnotifiLoad(false);
          } else {
            setnotifiLoad(false);
          }
        } else {
          setnotifiLoad(false);
          console.log('status-error');
        }
      } catch (error) {
        setnotifiLoad(false);
        console.log(error, 'read notification api');
      }
    }
  };

  return (
    <View style={{flex: 1}}>
      <View>
        <AppHeader
          title={headerTitle}
          rightOptions
          onPressBack={() => {
            navigation.goBack();
          }}
          onPressNotify={() => {
            navigation.navigate('notification');
          }}
          onpressSetting={() => {
            navigation.navigate('categories');
          }}
        />
      </View>
      <View
        style={{
          flex: 1,
        }}>
        {selection == 1 && (
          <EventInfo
            id={id}
            title={title}
            banner={banner}
            description={description}
            live_url={live_url}
            textual_event={textualEvent}
            setTextualEvent={setTextualEvent}
            textual_description={textual_description}
            fb={fb}
            twitter={twitter}
            insta={insta}
          />
        )}
        {selection == 2 && (
          <EventClasses
            classes={classes}
            load={classesload}
            refresh={classRefresh}
            onRefresh={onClassRefresh}
          />
        )}
        {selection == 3 && (
          <EventUpdates
            Updates={Updates}
            load={Updatesload}
            refresh={updatesRefresh}
            onRefresh={onUpdatesRefresh}
          />
        )}
        {selection == 4 && (
          <EventPushNotification
            classes={classes}
            eventActive={eventActive}
            classActive={classActive}
            notifi={notifi}
            allReaded={markReadNotifi}
            load={notifiload}
            setClassActive={setClassActive}
            setEventActive={setEventActive}
            deleteRow={deleteRow}
            setSelection={switchSelection}
            deleteMessage={deleteMessage}
            onRefresh={onNotificationRefresh}
            refresh={notifeeRefresh}
          />
        )}
      </View>
      {(textualEvent == 0 || textualEvent == '0') && (
        <View
          style={{alignItems: 'center', position: 'relative', width: '100%'}}>
          <View style={styles.buttonContainer}>
            <BottomButtons
              switchOne={'Eventhome'}
              switchTwo={'Documenten'}
              switchThree={'Updates'}
              switchFour={'Push notificatie'}
              onSelect={switchSelection}
              activeSwitch={selection}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const {width, height} = Dimensions.get('screen');

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: 'center',
    flex: 1,
    marginBottom: width < 500 ? 85 : 95,
    zIndex: 1000,
    position: 'absolute',
    bottom: 0,
    maxWidth: width - 40,
  },
});
