import React, {useEffect, useRef, useState, useCallback} from 'react';
import {Text, View, StyleSheet, ScrollView} from 'react-native';
import SettingCards from '../../components/Cards/SettingCards';
import {appFont} from '../../utilities/appFonts';
import {appColors} from '../../utilities/appColors';
import {useSelector, useDispatch} from 'react-redux';
import eventSettingSlice, {
  setRefreshControll,
} from '../../redux/eventSettingSlice';
import {SettingCardsShim} from '../../utilities/appShimmer';
import {useIsFocused} from '@react-navigation/native';
import {settingApi} from '../../redux/eventSettingSlice';

function CategoriesScreen() {
  const dispatch = useDispatch();
  const {settingData, isLoader, refresControll} = useSelector(
    state => state.eventSetting,
  );
  const {fcmToken, userAgent} = useSelector(state => state.settings);
  const isFocused = useIsFocused();
  const [refreshing, setRefreshing] = useState(false);

  // initial call:
  useEffect(() => {
    if (fcmToken && userAgent && userAgent != '') {
      setTimeout(() => {
        dispatch(
          settingApi({fcmToken: fcmToken, userAgent: userAgent, enter: 'yes'}),
        );
      }, 300);
    }
  }, [fcmToken]);

  const onRefresh = useCallback(() => {
    dispatch(setRefreshControll(true));
  }, []);

  // pull to refresh to call
  useEffect(() => {
    if (
      isFocused &&
      fcmToken &&
      userAgent &&
      userAgent != '' &&
      refresControll
    ) {
      dispatch(
        settingApi({fcmToken: fcmToken, userAgent: userAgent, enter: 'yes'}),
      );
    }
  }, [refresControll]);

  // unfocus to change for save:
  useEffect(() => {
    if (!isFocused && fcmToken && userAgent && userAgent != '') {
      dispatch(
        settingApi({fcmToken: fcmToken, userAgent: userAgent, enter: 'no'}),
      );
    }
  }, [isFocused]);

  return (
    <View style={{flex: 1, paddingHorizontal: 15}}>
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Text style={styles.head}>
          Voor welke sectie wil je evenementen volgen?
        </Text>
      </View>
      {isLoader && !refresControll ? (
        <View
          style={{
            marginHorizontal: 5,
          }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <SettingCardsShim />
          </ScrollView>
        </View>
      ) : (
        <SettingCards
          settingData={settingData}
          refreshing={refresControll}
          onRefresh={onRefresh}
        />
      )}
    </View>
  );
}

export default CategoriesScreen;

const styles = StyleSheet.create({
  head: {
    fontFamily: appFont.Lato_Bold,
    fontSize: 17,
    color: appColors.textBlack,
    width: 200,
    textAlign: 'center',
    marginBottom: 20,
  },
});
