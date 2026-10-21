import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  View,
  RefreshControl,
  Pressable,
} from 'react-native';
import {SwipeListView} from 'react-native-swipe-list-view';
import {useSelector} from 'react-redux';
import {NotificationCard} from '../../components/Cards/NotificationCard';
import {appColors} from '../../utilities/appColors';
import {Icon} from '../../utilities/AppIcons';
import {appFont} from '../../utilities/appFonts';
import {url} from '../../utilities/appApi';
import {fontScalling} from '../../utilities/HelpeFunction';
import {Switch} from 'react-native-switch';
import {EventPushNotificationShim} from '../../utilities/appShimmer';

export const EventPushNotification = ({
  eventActive,
  setEventActive,
  setClassActive,
  classActive,
  notifi,
  load,
  deleteRow,
  deleteMessage,
  classes,
  onRefresh,
  refresh,
  setSelection,
  allReaded,
}) => {
  const {fcmToken, userAgent} = useSelector(state => state.settings);

  const renderHiddenItem = data => {
    return (
      <View style={[styles.rowBack]}>
        <TouchableOpacity
          style={styles.backRightBtn}
          onPress={() => {
            deleteRow(data.item.id);
            deleteMessage('single', data.item.id, data.item.msgtype);
          }}>
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

  // to check the length of subtabs files:
  const isMarkReadedbtn = notifi.some(val => {
    return val?.read_status == '0';
  });

  return (
    <View style={{flex: 1, paddingHorizontal: 20}}>
      <>
        <View>
          <Pressable
            onPress={() => {
              setEventActive(eventActive == '0' ? '1' : '0');
              if (eventActive == '1') {
                setClassActive('0');
              }
            }}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingTop: 5,
            }}>
            <View style={{alignItems: 'center', justifyContent: 'flex-start'}}>
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
              <Text style={styles.title}>Evenement notificaties</Text>
              <View style={{paddingVertical: 10}}>
                <Text style={styles.descrip}>
                  Ontvang push notificaties die betrekking hebben op het
                  evenement.
                </Text>
              </View>
            </View>
            <View style={{paddingRight: 5}}>
              <Switch
                value={eventActive == '1'}
                onValueChange={val => {
                  setEventActive(val ? '1' : '0');
                  if (val == '0') {
                    setClassActive('0');
                  }
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
                outerCircleStyle={{shadowOffset: 2, shadowColor: '#000'}}
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
              setClassActive(classActive == '0' ? '1' : '0');
              if (classActive == '0') {
                setEventActive('1');
              }
            }}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingTop: 10,
            }}>
            <View style={{alignItems: 'center', justifyContent: 'flex-start'}}>
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
              <Text style={styles.title}>Document notificaties</Text>
              <View style={{paddingVertical: 10}}>
                <Text style={styles.descrip}>
                  Zet met één druk op de knop alle push notificaties aan voor de
                  documenten van dit evenement.
                </Text>
              </View>
            </View>
            <View style={{paddingRight: 5}}>
              <Switch
                value={classActive == '1'}
                onValueChange={val => {
                  setClassActive(val ? '1' : '0');
                  if (val == '1') {
                    setEventActive('1');
                  }
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
                outerCircleStyle={{shadowOffset: 2, shadowColor: '#000'}}
                switchLeftPx={3}
                switchRightPx={3}
                switchWidthMultiplier={1.5}
                switchBorderRadius={30}
                activeText={''}
                inActiveText={''}
              />
            </View>
          </Pressable>
        </View>
        {!load ? (
          <>
            {notifi && notifi.length > 0 ? (
              <>
                {isMarkReadedbtn && (
                  <TouchableOpacity
                    style={{marginLeft: 'auto', marginBottom: 10}}
                    onPress={() => {
                      allReaded();
                    }}>
                    <Text style={[styles.descrip, {color: appColors.themeRed}]}>
                      Markeer alle als gelezen
                    </Text>
                  </TouchableOpacity>
                )}
                <SwipeListView
                  data={notifi}
                  refreshControl={
                    <RefreshControl
                      refreshing={refresh}
                      onRefresh={onRefresh}
                    />
                  }
                  ItemSeparatorComponent={() => {
                    return <View style={{padding: 5}}></View>;
                  }}
                  renderItem={({item, index}) => {
                    return (
                      <NotificationCard
                        setSelection={setSelection}
                        readApi={readStatusApi}
                        data={item}
                        key={index}
                        eventNoti={true}
                      />
                    );
                  }}
                  keyExtractor={item => item.id}
                  leftOpenValue={5}
                  rightOpenValue={-90}
                  previewRowKey={'0'}
                  previewOpenValue={-40}
                  previewOpenDelay={3000}
                  showsVerticalScrollIndicator={false}
                  renderHiddenItem={renderHiddenItem}
                  ListFooterComponent={
                    <View style={{marginBottom: width < 500 ? 155 : 175}} />
                  }
                />
              </>
            ) : (
              <ScrollView
                refreshControl={
                  <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
                }
                contentContainerStyle={{
                  flex: 0.7,
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
      </>
    </View>
  );
};

const {width, height} = Dimensions.get('screen');

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
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: appColors.screenBg,
  },
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
