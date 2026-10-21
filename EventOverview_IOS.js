import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  FlatList,
  Pressable,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from 'react-native';
import {appColors} from '../../utilities/appColors';
import {appFont} from '../../utilities/appFonts';
import {fontScalling, print} from '../../utilities/HelpeFunction';
import {Icon} from '../../utilities/AppIcons';
import {useNavigation} from '@react-navigation/native';
import {EventShim} from '../../utilities/appShimmer';

// IOS Files

const {width} = Dimensions.get('screen');

const dateObj = (type, date) =>
  new Date(date).toLocaleString('nl-NL', {
    [type]: '2-digit',
  });

const dayValid = str => {
  return str && str != '' && '1970-01-01' != str ? true : false;
};

// Actueel:
export const Toekomst = ({
  eventOverview1,
  paging,
  loading,
  onRefresh,
  refreshing,
}) => {
  const navigation = useNavigation();
  const eventdata1 = eventOverview1.data;

  return (
    <>
      {!loading ? (
        <View style={{flex: 1}}>
          {eventdata1 && eventdata1.length > 0 ? (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={eventdata1}
              style={{flex: 1}}
              keyExtractor={(data, index) => index}
              refreshControl={
                eventdata1.length > 0 ? (
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                ) : null
              }
              renderItem={data => {
                let day;
                let month;
                let year;

                day = dayValid(data.item.event_date)
                  ? dateObj('day', data.item.event_date)
                  : '';
                month = dayValid(data.item.event_date)
                  ? dateObj('month', data.item.event_date)
                  : '';
                year = dayValid(data.item.event_date)
                  ? dateObj('year', data.item.event_date)
                  : '';

                // -----------------------------
                let endDay;
                let endMonth;
                let endYear;
                endDay = dayValid(data.item.event_date_till)
                  ? dateObj('day', data.item.event_date_till)
                  : '';
                endMonth = dayValid(data.item.event_date_till)
                  ? dateObj('month', data.item.event_date_till)
                  : '';
                endYear = dayValid(data.item.event_date_till)
                  ? dateObj('year', data.item.event_date_till)
                  : '';
                return (
                  <View
                    key={data.index}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <View
                      style={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        position: 'relative',
                      }}>
                      <View style={styles.dot} />
                      {data.index < eventdata1.length - 1 && (
                        <View style={styles.line} />
                      )}
                    </View>
                    <Pressable
                      onPress={() => {
                        navigation.navigate('eventDetails', {
                          title: data.item.title,
                          banner: data.item.banner,
                          description: data.item.description,
                          id: data.item.id,
                          live_url: data.item.live_url,
                          class_active: data.item.class_active,
                          event_active: data.item.event_active,
                          textual_description: data.item.textual_description,
                          textual_event: data.item.textual_event,
                          fb: data.item.fb,
                          twitter: data.item.twitter,
                          insta: data.item.insta,
                        });
                      }}
                      style={{flex: 1, paddingHorizontal: 10}}>
                      <View style={styles.conatiner}>
                        <View style={styles.imgBack}>
                          {data.item.logo && data.item.logo != '' && (
                            <Image
                              source={{uri: data.item.logo}}
                              resizeMode="cover"
                              style={{width: '100%', height: '100%'}}
                            />
                          )}
                        </View>
                        <View style={{flex: 1, paddingHorizontal: 10}}>
                          <Text style={styles.title} numberOfLines={2}>
                            {data.item.title}
                          </Text>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              paddingVertical: 10,
                            }}>
                            <Icon
                              ComponentName={'EvilIcons'}
                              name={'location'}
                              color={appColors.grayBlack}
                              size={18}
                            />
                            <Text style={styles.location} numberOfLines={1}>
                              {data.item.address}
                            </Text>
                          </View>
                        </View>
                        <View style={{paddingLeft: 5}}>
                          {dayValid(data.item.event_date) && (
                            <View
                              style={{
                                alignItems: 'center',
                                paddingHorizontal: 5,
                              }}>
                              <Text
                                style={[
                                  styles.redText,
                                  {fontSize: fontScalling(3), paddingBottom: 1},
                                ]}>
                                {day}
                              </Text>
                              <Text
                                style={[
                                  styles.redText,
                                  {
                                    fontSize: fontScalling(1.3),
                                    color: appColors.orange,
                                  },
                                ]}>
                                {`${month}-${year}`}
                              </Text>
                            </View>
                          )}
                          {dayValid(data.item.event_date_till) && (
                            <>
                              <View
                                style={{
                                  // width: '100%',
                                  height: 4,
                                  backgroundColor: appColors.grayBlack,
                                  marginTop: 5,
                                  marginBottom: 3,
                                  borderRadius: 5,
                                  marginHorizontal: 10,
                                }}
                              />
                              <View
                                style={{
                                  alignItems: 'center',
                                  paddingHorizontal: 5,
                                }}>
                                <Text
                                  style={[
                                    styles.redText,
                                    {
                                      fontSize: fontScalling(3),
                                      paddingBottom: 3,
                                    },
                                  ]}>
                                  {endDay}
                                </Text>
                                <Text
                                  style={[
                                    styles.redText,
                                    {
                                      fontSize: fontScalling(1.3),
                                      color: appColors.orange,
                                    },
                                  ]}>
                                  {`${endMonth}-${endYear}`}
                                </Text>
                              </View>
                            </>
                          )}
                        </View>
                      </View>
                    </Pressable>
                  </View>
                );
              }}
              onEndReached={() => {
                if (!refreshing) {
                  if (eventOverview1.count > 0 && eventdata1.length > 0) {
                    eventOverview1.page == eventOverview1.count
                      ? null
                      : paging();
                  }
                }
              }}
              ListFooterComponent={
                eventOverview1.page == eventOverview1.count ? (
                  <View style={{marginBottom: 80}}></View>
                ) : (
                  <>
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
                    <View style={{marginBottom: 60}}></View>
                  </>
                )
              }
            />
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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
                }}>
                Er zijn geen evenementen gevonden
              </Text>
              <View style={{marginBottom: 70}}></View>
            </ScrollView>
          )}
        </View>
      ) : (
        !refreshing && (
          <View style={{flex: 0.9}}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <EventShim />
            </ScrollView>
          </View>
        )
      )}
    </>
  );
};

// Verleden:
export const Verledan = ({
  eventOverview2,
  paging,
  loading,
  onRefresh,
  refreshing,
}) => {
  const navigation = useNavigation();
  const eventdata2 = eventOverview2.data;

  return (
    <>
      {!loading ? (
        <View style={{flex: 1}}>
          {eventdata2 && eventdata2.length > 0 ? (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={eventdata2}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              keyExtractor={(data, index) => index}
              extraData={eventdata2.length}
              renderItem={data => {
                let day;
                let month;
                let year;

                day = dayValid(data.item.event_date)
                  ? dateObj('day', data.item.event_date)
                  : '';
                month = dayValid(data.item.event_date)
                  ? dateObj('month', data.item.event_date)
                  : '';
                year = dayValid(data.item.event_date)
                  ? dateObj('year', data.item.event_date)
                  : '';

                // -----------------------------
                let endDay;
                let endMonth;
                let endYear;
                endDay = dayValid(data.item.event_date_till)
                  ? dateObj('day', data.item.event_date_till)
                  : '';
                endMonth = dayValid(data.item.event_date_till)
                  ? dateObj('month', data.item.event_date_till)
                  : '';
                endYear = dayValid(data.item.event_date_till)
                  ? dateObj('year', data.item.event_date_till)
                  : '';

                return (
                  <View
                    key={data.index}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <View
                      style={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        position: 'relative',
                      }}>
                      <View style={styles.dot} />
                      {data.index < eventdata2.length - 1 && (
                        <View style={styles.line} />
                      )}
                    </View>
                    <Pressable
                      onPress={() => {
                        navigation.navigate('eventDetails', {
                          title: data.item.title,
                          banner: data.item.banner,
                          description: data.item.description,
                          id: data.item.id,
                          live_url: data.item.live_url,
                          class_active: data.item.class_active,
                          event_active: data.item.event_active,
                          textual_description: data.item.textual_description,
                          textual_event: data.item.textual_event,
                          fb: data.item.fb,
                          twitter: data.item.twitter,
                          insta: data.item.insta,
                        });
                      }}
                      style={{flex: 1, paddingHorizontal: 10}}>
                      <View style={styles.conatiner}>
                        <View style={styles.imgBack}>
                          {data?.item?.logo && data?.item?.logo != '' && (
                            <Image
                              source={{uri: data.item.logo}}
                              resizeMode="cover"
                              style={{width: '100%', height: '100%'}}
                            />
                          )}
                        </View>
                        <View style={{flex: 1, paddingHorizontal: 10}}>
                          <Text style={styles.title} numberOfLines={2}>
                            {data.item.title}
                          </Text>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              paddingVertical: 10,
                            }}>
                            <Icon
                              ComponentName={'EvilIcons'}
                              name={'location'}
                              color={appColors.grayBlack}
                              size={18}
                            />
                            <Text style={styles.location} numberOfLines={1}>
                              {data.item.address}
                            </Text>
                          </View>
                        </View>
                        {/* <View
                          style={{alignItems: 'center', paddingHorizontal: 5}}>
                          <Text
                            style={[
                              styles.redText,
                              {fontSize: fontScalling(2.5)},
                            ]}>
                            {day}
                          </Text>
                          <Text
                            style={[
                              styles.redText,
                              {fontSize: fontScalling(1.8)},
                            ]}>
                            {month}
                          </Text>
                          <Text
                            style={[
                              styles.redText,
                              {fontSize: fontScalling(1.6)},
                            ]}>
                            {year}
                          </Text>
                        </View> */}
                        <View style={{paddingLeft: 5}}>
                          {dayValid(data.item.event_date) && (
                            <View
                              style={{
                                alignItems: 'center',
                                paddingHorizontal: 5,
                              }}>
                              <Text
                                style={[
                                  styles.redText,
                                  {fontSize: fontScalling(3), paddingBottom: 1},
                                ]}>
                                {day}
                              </Text>
                              <Text
                                style={[
                                  styles.redText,
                                  {
                                    fontSize: fontScalling(1.3),
                                    color: appColors.orange,
                                  },
                                ]}>
                                {`${month}-${year}`}
                              </Text>
                            </View>
                          )}
                          {dayValid(data.item.event_date_till) && (
                            <>
                              <View
                                style={{
                                  // width: '100%',
                                  height: 4,
                                  backgroundColor: appColors.grayBlack,
                                  marginTop: 5,
                                  marginBottom: 3,
                                  borderRadius: 5,
                                  marginHorizontal: 10,
                                }}
                              />
                              <View
                                style={{
                                  alignItems: 'center',
                                  paddingHorizontal: 5,
                                }}>
                                <Text
                                  style={[
                                    styles.redText,
                                    {
                                      fontSize: fontScalling(3),
                                      paddingBottom: 3,
                                    },
                                  ]}>
                                  {endDay}
                                </Text>
                                <Text
                                  style={[
                                    styles.redText,
                                    {
                                      fontSize: fontScalling(1.3),
                                      color: appColors.orange,
                                    },
                                  ]}>
                                  {`${endMonth}-${endYear}`}
                                </Text>
                              </View>
                            </>
                          )}
                        </View>
                      </View>
                    </Pressable>
                  </View>
                );
              }}
              onEndReached={() => {
                if (
                  eventOverview2.count > 0 &&
                  eventdata2.length > 0 &&
                  !refreshing
                ) {
                  eventOverview2.page == eventOverview2.count ? null : paging();
                }
              }}
              ListFooterComponent={
                eventOverview2.page == eventOverview2.count ? (
                  <View style={{marginBottom: 80}}></View>
                ) : (
                  <>
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
                    <View style={{marginBottom: 60}}></View>
                  </>
                )
              }
            />
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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
                }}>
                Er zijn geen evenementen gevonden
              </Text>
              <View style={{marginBottom: 70}}></View>
            </ScrollView>
          )}
        </View>
      ) : (
        <View style={{flex: 0.9}}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <EventShim />
          </ScrollView>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  dot: {
    width: width > 500 ? width / 24 : width / 16,
    height: width > 500 ? width / 24 : width / 16,
    backgroundColor: appColors.themeRed,
    shadowColor: appColors.themeRed,
    borderRadius: 20,
    borderColor: appColors.shadowred,
    borderWidth: 5,
  },
  line: {
    borderColor: appColors.themeRed,
    width: 2,
    height: '100%',
    backgroundColor: appColors.themeRed,
    borderRadius: 30,
    marginTop: -10,
    position: 'absolute',
    top: 15,
    bottom: 0,
  },
  conatiner: {
    backgroundColor: appColors.white,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
  },
  imgBack: {
    width: width / 5,
    height: width / 5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: appColors.textBlack,
    fontFamily: appFont.Lato_Bold,
    fontSize: fontScalling(1.8),
  },
  location: {
    color: appColors.grayBlack,
    fontFamily: appFont.Lato_Bold,
    fontSize: fontScalling(1.5),
  },
  redText: {
    color: appColors.themeRed,
    fontFamily: appFont.Lato_Bold,
  },
});
