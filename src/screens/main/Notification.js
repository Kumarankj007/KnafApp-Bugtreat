import React, {useEffect, useState, useCallback, useRef} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Text,
  Dimensions,
  Pressable,
  RefreshControl,
  ScrollView,
  AppState,
} from 'react-native';
import {SwipeListView} from 'react-native-swipe-list-view';
import {NotificationCard} from '../../components/Cards/NotificationCard';
import {Icon} from '../../utilities/AppIcons';
import {appColors} from '../../utilities/appColors';
import {useDispatch, useSelector} from 'react-redux';
import {url} from '../../utilities/appApi';
import {useIsFocused} from '@react-navigation/native';
import Modal from 'react-native-modal';
import {appFont} from '../../utilities/appFonts';
import {fontScalling} from '../../utilities/HelpeFunction';
import {
  setInfoContentTrigger,
  setNotifeeDeleteModal,
  setNotifeeMessageLength,
} from '../../redux/globalUseSlice';
import {useToast} from 'react-native-toast-notifications';
import {EventPushNotificationShim} from '../../utilities/appShimmer';
import messaging from '@react-native-firebase/messaging';

const {width, height} = Dimensions.get('screen');

export default function Noftification() {
  const [notifi, setNotifi] = useState({
    data: [],
    start: 0,
    limit: 10,
    count: 0,
    page: 0,
  });
  const [notifiStart, setNotifiStart] = useState(0);
  const [load, setLoad] = useState(false);
  const {fcmToken, userAgent} = useSelector(state => state.settings);
  const isFocus = useIsFocused();
  const dispatch = useDispatch();
  const [trigger, setTrigger] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  // console.log(notifi, 'notifi')

  const toast = useToast();
  const appState = useRef(AppState.currentState);

  const {notifeeDeleteModal, infoContentTrigger, notifeeTrigger} = useSelector(
    state => state.globalUse,
  );

  useEffect(() => {
    AppState.addEventListener('change', nextAppState => {
      if (nextAppState == 'active') {
        onRefresh();
        console.log(nextAppState, 'state', infoContentTrigger);
      }
    });
  }, [appState.current]);

  const onRefresh = useCallback((spinner = true) => {
    setNotifi(preData => ({
      data: preData.data,
      start: 0,
      limit: 10,
      count: 0,
      page: 0,
    }));
    setNotifiStart(0);
    if (spinner) {
      setRefreshing(true);
    }
  }, []);

  const paging = () => {
    return setNotifiStart(notifi.start + notifi.limit);
  };

  const deleteRow = rowId => {
    const newdata = [...notifi.data];
    const deleteIndex = notifi.data.findIndex(val => val.id == rowId);
    newdata.splice(deleteIndex, 1);
    setNotifi(predata => {
      return {...predata, data: newdata};
    });
  };

  //Delete Notifications
  const deleteMessage = async (mode, id = '', msgType = '') => {
    if (fcmToken && fcmToken != '' && userAgent && userAgent != '') {
      try {
        const headers = new Headers();
        const formdata = new FormData();

        headers.append('User-Agent', userAgent);
        formdata.append('deviceid', fcmToken);
        formdata.append('mode', mode);

        if (mode == 'single') {
          formdata.append('msgid', id);
          formdata.append('type', msgType);
        }

        const response = await fetch(url().deleteNotification, {
          method: 'POST',
          body: formdata,
          headers: headers,
        });
        if (response.status == 200) {
          const resparse = await response.json();
          if (resparse.status == 'success') {
            setNotifi(preData => ({...preData, start: preData.start - 1}));
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

            if (mode == 'multiple') {
              dispatch(setNotifeeDeleteModal(false));
              setNotifiStart(0);
              setNotifi(preDta => {
                return {
                  data: [],
                  count: 0,
                  page: 0,
                  start: 0,
                  limit: 0,
                };
              });
              setTrigger(trigger + 1);
            }
          }
        } else {
          console.log('status-error');
        }
      } catch (error) {
        console.log(error, 'delete add');
      }
    }
  };

  const readStatusApi = async (id = '', msgType = '') => {
    if (fcmToken && fcmToken != '' && userAgent && userAgent != '') {
      try {
        const headers = new Headers();
        const formdata = new FormData();

        headers.append('User-Agent', userAgent);
        formdata.append('deviceid', fcmToken);
        formdata.append('msgid', id);
        formdata.append('type', msgType);

        const response = await fetch(url().updateNotification, {
          method: 'POST',
          body: formdata,
          headers: headers,
        });
        if (response.status == 200) {
          const resparse = await response.json();
          if (resparse.status == 'success') {
          }
        } else {
          console.log('status-error');
        }
      } catch (error) {
        console.log(error, 'read notification api');
      }
    }
  };

  const markReadNotifi = async () => {
    if (fcmToken && fcmToken != '' && userAgent && userAgent != '') {
      try {
        setLoad(true);
        const headers = new Headers();
        const formdata = new FormData();

        headers.append('User-Agent', userAgent);
        formdata.append('deviceid', fcmToken);

        // console.log(formdata, 'datas', headers);

        const response = await fetch(url().markAsReadedNotifi, {
          method: 'POST',
          body: formdata,
          headers: headers,
        });
        if (response.status == 200) {
          const resparse = await response.json();
          if (resparse.status == 'success') {
            // console.log(resparse, 'resparse');
            setNotifi(preData => ({
              ...preData,
              data: [
                ...preData.data.map(data => ({...data, read_status: '1'})),
              ],
            }));
            dispatch(setInfoContentTrigger(infoContentTrigger + 1));
            setLoad(false);
          } else {
            setLoad(false);
          }
        } else {
          setLoad(false);
          console.log('status-error');
        }
      } catch (error) {
        setLoad(false);
        console.log(error, 'read notification api');
      }
    }
  };

  const fetchNotify = async () => {
    if (fcmToken && fcmToken != '' && userAgent && userAgent != '') {
      try {
        if (fcmToken != '') {
          if (!refreshing) {
            notifi?.data?.length == 0 ? setLoad(true) : setLoad(false);
          }
          dispatch(setInfoContentTrigger(infoContentTrigger + 1));
          const headers = new Headers();
          const formData = new FormData();

          headers.append('User-Agent', userAgent);
          formData.append('deviceid', fcmToken);
          formData.append('start', notifiStart);
          const response = await fetch(url().notificationList, {
            method: 'POST',
            body: formData,
            headers: headers,
          });
          if (response.status == 200) {
            const resparse = await response.json();
            if (resparse.status == 'success') {
              setNotifi(preData => {
                return {
                  data: refreshing
                    ? resparse.data
                    : [...preData.data, ...resparse.data],
                  count: Number(resparse.count),
                  page: Number(preData.page + 1),
                  start: Number(resparse.start),
                  limit: Number(resparse.limit),
                };
              });
              setLoad(false);
              setRefreshing(false);
              // console.log(JSON.stringify(resparse.data, undefined, 2), 'data');
            } else {
              console.log('empty data');
              setLoad(false);
              setRefreshing(false);
            }
          } else {
            console.log('notification page error :' + response.status);
            setLoad(false);
            setRefreshing(false);
          }
        }
      } catch (error) {
        setRefreshing(false);
        console.log('notify: ', error);
      }
    }
  };

  useEffect(() => {
    if (notifi?.data?.length > 0) {
      dispatch(setNotifeeMessageLength(true));
    } else {
      dispatch(setNotifeeMessageLength(false));
    }
  }, [notifi]);

  useEffect(() => {
    if (!isFocus) {
      (() => {
        setNotifiStart(0);
        setNotifi(preDta => {
          return {
            data: [],
            count: 0,
            page: 0,
            start: 0,
            limit: 0,
          };
        });
        setTrigger(trigger + 1);
      })();
    }
  }, [isFocus, notifeeTrigger]);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      setNotifiStart(0);
      setNotifi(preDta => {
        return {
          data: [],
          count: 0,
          page: 0,
          start: 0,
          limit: 0,
        };
      });
      fetchNotify();
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (refreshing) {
      fetchNotify();
    }
  }, [refreshing]);

  useEffect(() => {
    fetchNotify();
  }, [notifiStart, trigger]);

  const renderHiddenItem = ({item}) => {
    return (
      <View style={styles.rowBack}>
        <TouchableOpacity
          onPress={() => {
            deleteRow(item.id);
            deleteMessage('single', item.id, item.msgtype);
          }}
          style={styles.backRightBtn}>
          <Icon
            ComponentName={'FontAwesome5'}
            name={'trash-alt'}
            size={20}
            color={appColors.white}
          />
        </TouchableOpacity>
      </View>
    );
  };

  // to check the length of subtabs files:
  const isMarkReadedbtn = notifi.data.some(val => {
    return val?.read_status == '0';
  });

  return (
    <View style={{flex: 1, paddingHorizontal: 20}}>
      {!load ? (
        <>
          {notifi && notifi.data?.length > 0 ? (
            <>
              {isMarkReadedbtn && (
                <TouchableOpacity
                  style={{marginLeft: 'auto', marginBottom: 10}}
                  onPress={() => {
                    markReadNotifi();
                  }}>
                  <Text style={[styles.descrip, {color: appColors.themeRed}]}>
                    Markeer alle als gelezen
                  </Text>
                </TouchableOpacity>
              )}
              <SwipeListView
                refreshControl={
                  <RefreshControl
                    onRefresh={onRefresh}
                    refreshing={refreshing}
                  />
                }
                data={notifi.data}
                ItemSeparatorComponent={() => {
                  return <View style={{padding: 5}}></View>;
                }}
                renderItem={({item, index}) => {
                  // console.log(JSON.stringify(item, undefined, 4), 'notifi item');
                  return (
                    <NotificationCard
                      readApi={readStatusApi}
                      data={item}
                      key={index}
                    />
                  );
                }}
                keyExtractor={(item, index) => {
                  return item.id ? `${item.id}-${index}` : `key-${index}`;
                }}
                leftOpenValue={5}
                rightOpenValue={-90}
                previewRowKey={'0'}
                previewOpenValue={-40}
                previewOpenDelay={3000}
                showsVerticalScrollIndicator={false}
                renderHiddenItem={renderHiddenItem}
                onEndReached={() =>
                  notifi.page == notifi.count ? null : paging()
                }
                ListFooterComponent={
                  notifi.page == notifi.count ? (
                    <View style={{marginBottom: 20}}></View>
                  ) : (
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 40,
                        width: '100%',
                      }}>
                      <ActivityIndicator
                        size={'small'}
                        color={appColors.themeRed}
                      />
                    </View>
                  )
                }
              />
            </>
          ) : (
            <ScrollView
              refreshControl={
                <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
              }
              contentContainerStyle={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: appColors.themeBlue,
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: appFont.Lato_Bold,
                  textAlign: 'center',
                  fontSize: fontScalling(1.8),
                  lineHeight: fontScalling(2),
                }}>
                Er zijn nog geen meldingen
              </Text>
            </ScrollView>
          )}
        </>
      ) : (
        <View
          style={{
            marginHorizontal: 5,
          }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <EventPushNotificationShim />
          </ScrollView>
        </View>
      )}
      <Modal
        deviceHeight={height}
        deviceWidth={width}
        animationType="slide"
        transparent={true}
        isVisible={notifeeDeleteModal}
        backdropColor={appColors.overlayBg}
        backdropOpacity={1}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          height: height,
        }}
        onBackdropPress={() => dispatch(setNotifeeDeleteModal(false))}
        onRequestClose={() => {
          dispatch(setNotifeeDeleteModal(!notifeeDeleteModal));
        }}>
        <View
          style={{
            backgroundColor: 'white',
            paddingHorizontal: 15,
            paddingVertical: 20,
            borderRadius: 5,
            width: '100%',
            maxWidth: 400,
            elevation: 10,
          }}>
          <Text
            style={{
              marginBottom: 20,
              fontFamily: appFont.Lato_Regular,
              fontSize: fontScalling(width > 500 ? 2.5 : 2.2),
              color: appColors.textBlack,
              textAlign: 'center',
            }}>
            Weet je zeker dat je alle ontvangen meldingen wilt verwijderen? Je
            kunt dit niet ongedaan maken.
          </Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Pressable
              style={{
                backgroundColor: appColors.themeRed,
                paddingHorizontal: 15,
                paddingVertical: 9,
                borderRadius: 3,
                width: 130,
              }}
              onPress={() => {
                if (notifi && notifi.data?.length > 0) {
                  deleteMessage('multiple', '', '');
                } else {
                  dispatch(setNotifeeDeleteModal(false));
                }
              }}>
              <Text
                style={{
                  fontFamily: appFont.Lato_Bold,
                  fontSize: fontScalling(width > 500 ? 2.5 : 2),
                  color: appColors.white,
                  textAlign: 'center',
                  textTransform: 'capitalize',
                }}>
                Verwijderen
              </Text>
            </Pressable>
            <Pressable
              style={{
                backgroundColor: appColors.themeBlue,
                paddingHorizontal: 15,
                paddingVertical: 9,
                borderRadius: 3,
                marginLeft: 10,
                width: 130,
              }}
              onPress={() => dispatch(setNotifeeDeleteModal(false))}>
              <Text
                style={{
                  fontFamily: appFont.Lato_Bold,
                  fontSize: fontScalling(width > 500 ? 2.5 : 2),
                  color: appColors.white,
                  textAlign: 'center',
                  textTransform: 'capitalize',
                }}>
                Annuleren
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <View style={{paddingBottom: 70}} />
    </View>
  );
}

const styles = StyleSheet.create({
  backRightBtn: {
    width: 70,
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 38,
    justifyContent: 'center',
    backgroundColor: appColors.themeBlue,
  },
  rowBack: {
    // height: '100%',
    // paddingBottom: 13,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: appColors.screenBg,
  },
  descrip: {
    color: appColors.textBlack,
    fontFamily: appFont.Lato_Regular,
    fontSize: fontScalling(1.8),
  },
});
