import React, {useEffect, useState, useRef, useCallback} from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  View,
  Text,
  FlatList,
  AppState,
  Pressable,
  RefreshControl,
} from 'react-native';
import {Icon} from '../../utilities/AppIcons';
import {appColors} from '../../utilities/appColors';
import {appFont} from '../../utilities/appFonts';
import {fontScalling} from '../../utilities/HelpeFunction';
import {RedButton} from '../../components/Buttons/RedButton';
import {useDispatch} from 'react-redux';
import {setReaderTitle, setTabTitle} from '../../redux/TitleSlice';
import {Switch} from 'react-native-switch';
import {useSelector} from 'react-redux';
import {url} from '../../utilities/appApi';
import {useIsFocused} from '@react-navigation/native';
import HtmlView from '../../components/html/HtmlView';
import {ThemeCard} from '../../components/Cards/ThemeCard';
import {EventClassShim} from '../../utilities/appShimmer';

const {width, height} = Dimensions.get('screen');

export default function ClassDetails({navigation, route}) {
  const {subtabs, classId, eventId, class_desc, pushnotification} =
    route.params;
  const [refresh, setRefresh] = useState(false);
  const [load, setLoad] = useState(false);
  const [classDetails, setClassDetails] = useState({
    subtabs: subtabs,
    classId: classId,
    eventId: eventId,
    class_desc: class_desc,
    pushnotification: pushnotification,
  });
  const [isEnabled, setIsEnabled] = useState(false);
  const [classNotify, setClassNotify] = useState('0');
  const [notifeePending, setNotifeePending] = useState(false);
  // console.log(JSON.stringify(classDetails?.subtabs, undefined, 2), 'subtabs');

  const isFocused = useIsFocused();
  const {fcmToken, userAgent} = useSelector(state => state.settings);
  const dispatch = useDispatch();
  // console.log(classDetails, 'classDetails');

  // Class Notification Status:
  const classNotification = async (trigger = false) => {
    if (userAgent && userAgent != '') {
      try {
        setNotifeePending(true);
        const formData = new FormData();
        const headers = new Headers();
        headers.append('User-Agent', userAgent);

        formData.append('deviceid', fcmToken);
        formData.append('class_id', classId);
        formData.append('event_id', eventId);

        if (trigger) {
          formData.append('class_active', classNotify);
        }

        const response = await fetch(url().classNotify, {
          method: 'POST',
          body: formData,
          headers: headers,
        });
        // console.log(formData, 'formData');
        const resparse = await response.json();
        if (response.status == 200) {
          // console.log(resparse);
          setClassNotify(resparse.class_active);
          setRefresh(false);
        } else {
          setRefresh(false);
          console.log('classNotify status code:', response.status);
        }
        setNotifeePending(false);
      } catch (error) {
        setRefresh(false);
        setNotifeePending(false);
        console.log(error, 'event class error');
      }
    }
  };

  useEffect(() => {
    if (!notifeePending) {
      setTimeout(() => {
        classNotification();
      }, 100);
    }
  }, [isFocused]);

  useEffect(() => {
    if (!isFocused && !notifeePending) {
      classNotification(true);
    }
  }, [isFocused]);

  // api call for pull to refresh:
  const eventClasses = () => {
    if (userAgent && userAgent != '') {
      (async () => {
        try {
          const headers = new Headers();
          const formData = new FormData();

          headers.append('User-Agent', userAgent);
          formData.append('event_id', eventId);
          const response = await fetch(url().eventClasses, {
            method: 'POST',
            body: formData,
            headers: headers,
          });
          // console.log(response, 'formData');
          if (response.status == 200) {
            const resparse = await response.json();
            if (resparse.data) {
              const datas = resparse.data.filter(data => {
                return data.class_id == classId && data;
              });
              // console.log(JSON.stringify(datas[0], undefined, 2), 'datas');
              setClassDetails({
                class_desc: datas[0].class_desc,
                classId: datas[0].class_id,
                eventId: datas[0].event_id,
                pushnotification: datas[0].pushnotification,
                subtabs: datas[0].subtabs,
              });
              setLoad(false);
              setRefresh(false);
            }
          } else {
            setRefresh(false);
            setLoad(false);
            console.log('event class status code :', resparse.status);
          }
        } catch {
          setRefresh(false);
          setLoad(false);
          console.log('error occured');
        }
      })();
    }
  };

  const onRefresh = useCallback(() => {
    setRefresh(true);
  }, []);

  useEffect(() => {
    if (
      isFocused &&
      subtabs == undefined &&
      class_desc == undefined &&
      pushnotification == undefined
    ) {
      setLoad(true);
      eventClasses();
    }
    if (refresh) {
      classNotification();
      eventClasses();
    }
  }, [refresh, isFocused]);

  // console.log(classDetails.class_desc, 'classDetails.class_desc');

  // to check the length of subtabs files:
  const filesLength = classDetails?.subtabs?.some(val => {
    return val?.files.length > 0;
  });

  return (
    <View style={{flex: 1}}>
      {load ? (
        <View
          style={{
            marginBottom: 80,
            borderWidth: 4,
            borderColor: appColors.shimmer,
            borderRadius: 10,
            marginHorizontal: 10,
          }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <EventClassShim />
          </ScrollView>
        </View>
      ) : (
        <>
          <ScrollView
            contentContainerStyle={{
              paddingBottom: 80,
              flex:
                (classDetails?.class_desc?.trim() === '' &&
                  classDetails?.subtabs?.length == 0) ||
                !filesLength
                  ? 1
                  : 0,
            }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl onRefresh={onRefresh} refreshing={refresh} />
            }>
            <View
              style={{
                paddingHorizontal: 20,
              }}>
              {pushnotification && pushnotification == '1' && (
                <Pressable
                  onPress={() => setClassNotify(classNotify == '0' ? '1' : '0')}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                    }}>
                    <View style={styles.bell}>
                      <Icon
                        ComponentName={'FontAwesome'}
                        name={'bell-o'}
                        color={appColors.textBlack}
                        size={24}
                      />
                    </View>
                  </View>
                  <View style={{flex: 1, paddingHorizontal: 5}}>
                    <Text style={styles.title}>Notificaties</Text>
                    <View style={{paddingVertical: 10}}>
                      <Text style={styles.descrip}>
                        Zet met één druk op de knop alle push notificaties aan
                        voor deze sectie.
                      </Text>
                    </View>
                  </View>
                  <View style={{padding: 5}}>
                    <Switch
                      value={classNotify == '1'}
                      onValueChange={val => {
                        setClassNotify(val ? '1' : '0');
                      }}
                      disabled={false}
                      circleSize={20}
                      barHeight={13}
                      circleBorderWidth={4}
                      circleBorderInactiveColor={appColors.white}
                      circleBorderActiveColor={appColors.white}
                      backgroundActive={appColors.switchBg}
                      backgroundInactive={appColors.switchoff}
                      circleActiveColor={appColors.themeRed}
                      circleInActiveColor={appColors.themeBlue}
                      changeValueImmediately={true}
                      innerCircleStyle={{elevation: 3}}
                      containerStyle={{elevation: 3}}
                      outerCircleStyle={{
                        shadowOffset: 2,
                        shadowColor: '#000',
                      }}
                      switchLeftPx={3}
                      switchRightPx={3}
                      switchWidthMultiplier={1.5}
                      switchBorderRadius={30}
                      activeText={''}
                      inActiveText={''}
                    />
                  </View>
                </Pressable>
              )}
              {classDetails?.class_desc &&
                classDetails?.class_desc?.trim() !== '' && (
                  <View style={{marginBottom: 10}}>
                    <HtmlView url={classDetails.class_desc} />
                  </View>
                )}
            </View>
            {classDetails?.subtabs?.length > 0 && filesLength && (
              <>
                <FlatList
                  data={classDetails?.subtabs}
                  keyExtractor={(data, index) => index}
                  scrollEnabled={false}
                  showsVerticalScrollIndicator={false}
                  style={{flex: 1, paddingHorizontal: 20}}
                  renderItem={({item}) => {
                    return (
                      <>
                        {item?.files && item?.files?.length > 0 && (
                          <View style={{marginVertical: 5}}>
                            <RedButton
                              title={item.subtab_title}
                              blueback={true}
                              onPress={() => {
                                dispatch(setTabTitle(item.subtab_title));
                                if (item?.files?.length > 1) {
                                  navigation.navigate('classTab', {
                                    files: item.files,
                                    subtab_content: item.subtab_content,
                                    eventId: eventId,
                                    classId: classId,
                                    subtab_id: item.subtab_id,
                                  });
                                } else if (item?.files?.length == 1) {
                                  dispatch(setReaderTitle(item?.files[0]?.title));
                                  navigation.navigate('reader', {
                                    data: item?.files[0],
                                  });
                                }
                              }}
                            />
                          </View>
                        )}
                      </>
                    );
                  }}
                />
              </>
            )}
            {((classDetails?.class_desc?.trim() === '' &&
              classDetails?.subtabs?.length == 0) ||
              !filesLength) && (
              <>
                <View
                  style={{
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
                    Geen inhoud gevonden
                  </Text>
                </View>
              </>
            )}
          </ScrollView>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bell: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: appColors.white,
    width: width > 500 ? width / 12 : width / 8,
    height: width > 500 ? width / 12 : width / 8,
    borderRadius: 60,
  },
  title: {
    color: appColors.textBlack,
    fontFamily: appFont.Lato_Bold,
    fontSize: fontScalling(2),
  },
  descrip: {
    color: appColors.textBlack,
    fontFamily: appFont.Lato_Regular,
    fontSize: fontScalling(1.8),
  },
});
