import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ScrollView,
  Pressable,
  RefreshControl,
} from 'react-native';
import React from 'react';
import {appColors} from '../../utilities/appColors';
import {appFont} from '../../utilities/appFonts';
import {Switch} from 'react-native-switch';
import {useDispatch} from 'react-redux';
import {setSettingData} from '../../redux/eventSettingSlice';
import RunningTextAnimation from '../Animation/RunningTextAnimation';

const SettingCards = ({settingData, refreshing, onRefresh}) => {
  const dispatch = useDispatch();

  return (
    <>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        style={{flex: 1}}>
        {settingData &&
          settingData.length > 0 &&
          settingData.map((categ, index) => {
            return (
              <View
                key={categ.id}
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  marginBottom: 10,
                  borderRadius: 7,
                  overflow: 'hidden',
                }}>
                <View style={styles.cardLeft}>
                  <View
                    style={[
                      styles.images,
                      {
                        backgroundColor: categ.image
                          ? 'transparent'
                          : appColors.grayBlack,
                      },
                    ]}>
                    {categ.image && (
                      <Image
                        source={{uri: categ.image}}
                        style={{width: '100%', height: '100%'}}
                        resizeMode="cover"
                      />
                    )}
                  </View>
                  <View>
                    <Text
                      style={{
                        color: appColors.textBlack,
                        fontSize: 13,
                        fontFamily: appFont.Lato_Bold,
                        marginBottom: 5,
                      }}>
                      {categ.category}
                    </Text>
                    <View style={{flexDirection: 'row'}}>
                      {categ.up_next ? (
                        <View
                          style={{
                            flex: 1,
                            flexDirection: 'column',
                            marginBottom: 4,
                          }}>
                          <>
                            <Text
                              style={{
                                color: appColors.grayBlack,
                                fontSize: 11,
                                fontFamily: appFont.Lato_Regular,
                              }}>
                              Up next:
                            </Text>
                            <RunningTextAnimation text={categ.up_next} />
                          </>
                        </View>
                      ) : null}
                    </View>
                    <Text
                      style={{
                        color: appColors.themeRed,
                        fontSize: 11,
                        fontFamily: appFont.Lato_Regular,
                        width: width / 4,
                      }}>
                      {categ.date_time}
                    </Text>
                  </View>
                </View>
                <View style={styles.cardRight}>
                  <Pressable
                    onPress={() => {
                      let settings = [...settingData];
                      settings[index] = {
                        ...categ,
                        to_follow: settings[index].to_follow == '0' ? '1' : '0',
                      };
                      dispatch(setSettingData(settings));
                    }}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom: 15,
                      alignItems: 'center',
                    }}>
                    <View>
                      <Text
                        style={{
                          color: appColors.grayBlack,
                          fontSize: 13,
                          fontFamily: appFont.Lato_Regular,
                        }}>
                        Volgen
                      </Text>
                    </View>
                    <View>
                      <Switch
                        value={categ.to_follow == '1'}
                        onValueChange={val => {
                          let settings = [...settingData];
                          settings[index] = {
                            ...categ,
                            to_follow: val ? '1' : '0',
                          };
                          dispatch(setSettingData(settings));
                        }}
                        disabled={false}
                        circleSize={20}
                        barHeight={13}
                        circleBorderWidth={4}
                        circleBorderInactiveColor={appColors.white}
                        circleBorderActiveColor={appColors.white}
                        backgroundActive={appColors.switchBg}
                        backgroundInactive={appColors.switch}
                        circleActiveColor={appColors.themeRed}
                        circleInActiveColor={appColors.switch}
                        changeValueImmediately={true}
                        innerCircleStyle={{elevation: 3}}
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
                  <Pressable
                    onPress={() => {
                      let settings = [...settingData];
                      settings[index] = {
                        ...categ,
                        checked: settings[index].checked == '0' ? '1' : '0',
                      };
                      dispatch(setSettingData(settings));
                    }}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{
                        color: appColors.grayBlack,
                        fontSize: 13,
                        fontFamily: appFont.Lato_Regular,
                      }}>
                      Notificaties
                    </Text>
                    <Switch
                      value={categ.checked == '1'}
                      onValueChange={val => {
                        let settings = [...settingData];
                        settings[index] = {
                          ...categ,
                          checked: val ? '1' : '0',
                        };
                        dispatch(setSettingData(settings));
                      }}
                      disabled={false}
                      circleSize={20}
                      barHeight={13}
                      circleBorderWidth={4}
                      circleBorderInactiveColor={appColors.white}
                      circleBorderActiveColor={appColors.white}
                      backgroundActive={appColors.switchBg}
                      backgroundInactive={appColors.switch}
                      circleActiveColor={appColors.themeRed}
                      circleInActiveColor={appColors.switch}
                      changeValueImmediately={true}
                      innerCircleStyle={{elevation: 3}}
                      outerCircleStyle={{shadowOffset: 2, shadowColor: '#000'}}
                      switchLeftPx={3}
                      switchRightPx={3}
                      switchWidthMultiplier={1.5}
                      switchBorderRadius={30}
                      activeText={''}
                      inActiveText={''}
                    />
                  </Pressable>
                </View>
              </View>
            );
          })}
      </ScrollView>
      <View style={{marginBottom: 70}}></View>
    </>
  );
};

export default SettingCards;

const {width, height} = Dimensions.get('screen');

const styles = StyleSheet.create({
  cardLeft: {
    flexDirection: 'row',
    padding: 10,
    marginRight: 2,
    backgroundColor: appColors.white,
    alignItems: 'center',
    width: width / 1.85,
    height: width / 3.8,
  },
  images: {
    width: width / 5,
    height: width / 5,
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 13,
    backgroundColor: 'red',
  },
  cardRight: {
    flex: 1,
    padding: 10,
    paddingRight: 15,
    backgroundColor: appColors.white,
    width: width / 3.8,
    height: width / 3.8,
    justifyContent: 'center',
  },
});
