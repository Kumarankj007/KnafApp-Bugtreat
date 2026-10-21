import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  Image,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {appColors} from '../../utilities/appColors';
import {fontScalling} from '../../utilities/HelpeFunction';
import {appFont} from '../../utilities/appFonts';
import {useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import {
  setNotifeeTrigger,
  setInfoContentTrigger,
} from '../../redux/globalUseSlice';
import {Icon} from '../../utilities/AppIcons';
import {setTitle} from '../../redux/TitleSlice';

export const NotificationCard = ({
  readApi = () => {},
  data,
  eventNoti,
  setSelection,
}) => {
  const [expand, setExpand] = useState(false);
  const [showMoreBtn, setShowMoreBtn] = useState(false);
  const [numberOfLines, setNumberOfLines] = useState(undefined);
  const navigation = useNavigation();
  const {infoContentTrigger, notifeeTrigger} = useSelector(
    state => state.globalUse,
  );
  // console.log(JSON.stringify(data, undefined, 2), 'data');
  const dispatch = useDispatch();

  // onTextLayout:
  const onTextLayout = useCallback(
    e => {
      if (e.nativeEvent.lines.length > 2 && !showMoreBtn) {
        setShowMoreBtn(true);
        setNumberOfLines(2);
      }
    },
    [showMoreBtn],
  );

  useEffect(() => {
    setNumberOfLines(expand ? undefined : 2);
  }, [expand]);
  return (
    <Pressable
      onPress={() => {
        if (data.read_status == '0') {
          readApi(data.id, data.msgtype);
          dispatch(setNotifeeTrigger(notifeeTrigger + 1));
          dispatch(setInfoContentTrigger(infoContentTrigger + 1));
        }
        if (eventNoti) {
          data.msgtype != 'class'
            ? setSelection(1)
            : (dispatch(setTitle(data.class_name)),
              navigation.navigate('classDetails', {
                classId: data.class_id,
                eventId: data.event_id,
              }));
        } else {
          if (data.msgtype != 'class') {
            navigation.navigate('eventDetails', {
              title: data.event_name,
              banner: data.banner,
              description: data.description,
              textual_event: data.textual_event,
              textual_description: data.textual_description,
              id: data.event_id,
              fb: data.fb,
              twitter: data.twitter,
              insta: data.insta,
              live_url: data.live_url,
              routeSelection: data.msgtype == 'event' ? 1 : 2,
            });
          } else if (data.msgtype == 'class') {
            dispatch(setTitle(data.class_name));
            navigation.navigate('classDetails', {
              classId: data.class_id,
              eventId: data.event_id,
            });
          }
        }
      }}
      style={styles.container}>
      <View style={styles.imgBack}>
        {data?.notification_image && data?.notification_image != '' && (
          <Image
            source={{uri: data.notification_image}}
            resizeMode="cover"
            style={{width: '100%', height: '100%', borderRadius: 5}}
          />
        )}
      </View>
      <View style={{flex: 1, paddingLeft: 10}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          {data?.event_name && data?.event_name != '' && (
            <Text
              style={[styles.title, {flex: 1, paddingRight: 10}]}
              numberOfLines={1}>
              {data?.event_name}
            </Text>
          )}
          {data?.msgtype != 'event' && data?.class_name != '' && (
            <View style={styles.typeBack}>
              <Text style={[styles.text, {fontSize: fontScalling(1.2)}]}>
                {data?.class_name}
              </Text>
            </View>
          )}
        </View>
        {data?.notification && data?.notification != '' && (
          <Text
            onTextLayout={onTextLayout}
            numberOfLines={numberOfLines}
            style={styles.desc}>
            {data?.notification}
          </Text>
        )}
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}>
          <View>
            <Text style={styles.date}>{data.global_date} uur</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {showMoreBtn && (
              <TouchableOpacity
                style={{
                  paddingVertical: 3,
                  paddingHorizontal: 5,
                  shadowOpacity: 0.1,
                }}
                onPress={() => setExpand(!expand)}>
                <Icon
                  ComponentName={'AntDesign'}
                  name={expand ? 'upcircle' : 'downcircle'}
                  size={width > 500 ? 25 : 20}
                  color={appColors.grayBlack}
                />
              </TouchableOpacity>
            )}
            <View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end',
                }}>
                <Icon
                  name={'mail-unread-outline'}
                  color={
                    data.read_status == '0' ? appColors.themeRed : 'transparent'
                  }
                  ComponentName={'Ionicons'}
                  size={width < 500 ? 25 : 30}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const {width, height} = Dimensions.get('screen');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 5,
    backgroundColor: appColors.white,
    elevation: 5,
    shadowColor: appColors.textBlack,
    // marginBottom: 10,
  },
  title: {
    color: appColors.textBlack,
    fontSize: fontScalling(1.8),
    fontFamily: appFont.Lato_Bold,
  },
  desc: {
    color: appColors.grayBlack,
    fontFamily: appFont.Lato_Bold,
    fontSize: fontScalling(1.8),
    lineHeight: 18,
    paddingRight: 8,
    paddingVertical: 10,
  },
  date: {
    color: appColors.themeRed,
    fontFamily: appFont.Lato_Regular,
    fontSize: fontScalling(1.5),
  },
  imgBack: {
    width: width > 500 ? width / 8.5 : width / 5,
    height: width > 500 ? width / 8.5 : width / 5,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 5,
  },
  typeBack: {
    backgroundColor: appColors.themeBlue,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    borderRadius: 4,
  },
  newBack: {
    backgroundColor: appColors.themeRed,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    borderRadius: 30,
    width: width > 500 ? width / 30 : width / 15,
    height: width > 500 ? width / 30 : width / 15,
  },
  text: {
    color: appColors.white,
    fontFamily: appFont.Lato_Bold,
    fontSize: fontScalling(1.5),
  },
});
