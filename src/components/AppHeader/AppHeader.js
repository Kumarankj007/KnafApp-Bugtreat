import React from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import {appColors} from '../../utilities/appColors';
import {Icon} from '../../utilities/AppIcons';
import {appFont} from '../../utilities/appFonts';
import {fontScalling} from '../../utilities/HelpeFunction';
import {useSelector} from 'react-redux';

export const AppHeader = ({
  option,
  onpressSetting = () => {},
  onPressNotify = () => {},
  onPressDelete = () => {},
  onPressBack,
  onPressFilter = () => {},
  title,
  redBack,
  rightOptions,
  bin,
  filter,
}) => {
  const {infoContent} = useSelector(state => state.settings);
  const {notifeeMessageLength} = useSelector(state => state.globalUse);
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.headerContainer,
          {backgroundColor: redBack ? appColors.themeRed : appColors.screenBg},
        ]}>
        {onPressBack ? (
          <Pressable onPress={onPressBack} style={{padding: 3, paddingLeft: 0}}>
            <Icon
              ComponentName={'AntDesign'}
              name="arrowleft"
              color={redBack ? appColors.white : appColors.textBlack}
              size={24}
            />
          </Pressable>
        ) : null}
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            paddingHorizontal: 7,
          }}>
          <Text
            numberOfLines={1}
            style={[
              styles.header,
              {color: redBack ? appColors.white : appColors.textBlack},
            ]}>
            {option && option.title ? option.title : title}
          </Text>
        </View>
        {rightOptions ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10,
            }}>
            <Pressable
              onPress={onpressSetting}
              style={{padding: 3, paddingHorizontal: 0}}>
              <Icon
                ComponentName={'AntDesign'}
                name={'setting'}
                color={appColors.textBlack}
                size={24}
              />
            </Pressable>
            <Pressable onPress={onPressNotify} style={{alignItems: 'center'}}>
              {!(
                infoContent.notify_count == '0' ||
                infoContent.notify_count == '' ||
                infoContent.notify_count == 0 ||
                infoContent.notify_count == undefined
              ) && (
                <View style={[styles.count, {zIndex: 100, marginRight: -13}]}>
                  <Text
                    style={{
                      color: appColors.white,
                      fontFamily: appFont.Lato_Bold,
                      fontSize: 10,
                    }}>
                    {infoContent.notify_count}
                  </Text>
                </View>
              )}
              <Pressable
                onPress={onPressNotify}
                style={{
                  marginTop:
                    infoContent.notify_count == '0' ||
                    infoContent.notify_count == '' ||
                    infoContent.notify_count == 0 ||
                    infoContent.notify_count == undefined
                      ? 0
                      : -15,
                  padding: 5,
                  paddingHorizontal: 0,
                }}>
                <Icon
                  ComponentName={'FontAwesome'}
                  name={'bell-o'}
                  color={appColors.textBlack}
                  size={24}
                />
              </Pressable>
            </Pressable>
          </View>
        ) : bin && notifeeMessageLength ? (
          <View>
            <Pressable onPress={onPressDelete}>
              <Icon
                ComponentName={'FontAwesome'}
                name={'trash-o'}
                color={appColors.textBlack}
                size={24}
              />
            </Pressable>
          </View>
        ) : filter ? (
          <View style={{transform: [{rotate: '90deg'}]}}>
            <Pressable onPress={onPressFilter}>
              <Icon
                ComponentName={'Fontisto'}
                name={'equalizer'}
                color={appColors.textBlack}
                size={24}
              />
            </Pressable>
          </View>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 1000,
  },
  headerContainer: {
    zIndex: 1000,
    padding: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    backgroundColor: appColors.screenBg,
  },
  header: {
    color: appColors.textBlack,
    fontFamily: appFont.Lato_Bold,
    fontSize: fontScalling(2.8),
  },
  count: {
    backgroundColor: appColors.themeRed,
    alignItems: 'center',
    justifyContent: 'center',
    width: 20,
    height: 20,
    borderRadius: 20,
  },
});
