import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {appColors} from '../../utilities/appColors';
import {appFont} from '../../utilities/appFonts';
import {fontScalling} from '../../utilities/HelpeFunction';
import {Icon} from '../../utilities/AppIcons';
import {url} from '../../utilities/appApi';
import {useNavigation} from '@react-navigation/native';
import {EventUpdatesShim} from '../../utilities/appShimmer';
import {useDispatch} from 'react-redux';
import {setReaderTitle} from '../../redux/TitleSlice';

export const EventUpdates = ({Updates, load, refresh, onRefresh}) => {
  const {width, height} = Dimensions.get('screen');
  const navigation = useNavigation();
  const dispatch = useDispatch();
  // console.log(JSON.stringify(Updates, undefined, 2), 'updates');
  return (
    <>
      {!load ? (
        <View style={{paddingHorizontal: 20, flex: 1}}>
          {Updates && Updates.length > 0 ? (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={Updates}
              disableVirtualization={true}
              refreshControl={
                <RefreshControl onRefresh={onRefresh} refreshing={refresh} />
              }
              style={{flex: 1}}
              keyExtractor={item => item.id}
              renderItem={({item, index}) => {
                return (
                  <View style={styles.container} key={index}>
                    <View>
                      <View style={styles.timeBack}>
                        <Text style={styles.time}>{item.time_subtab}</Text>
                      </View>
                      <View>
                        <Text style={styles.date}>{item.date_subtab}</Text>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        position: 'relative',
                      }}>
                      <View style={styles.dot} />
                      {index < Updates.length - 1 && (
                        <View style={styles.line} />
                      )}
                    </View>
                    <View style={{flex: 1}}>
                      <Pressable
                        onPress={() => {
                          navigation.navigate('reader', {
                            data: item,
                            from: 'eventUpdate',
                          });
                          dispatch(setReaderTitle(item.title));
                        }}>
                        <View style={styles.boxContainer}>
                          <View style={{flex: 1}}>
                            <View style={{paddingVertical: 5}}>
                              <Text style={styles.title}>{item.title}</Text>
                            </View>
                            <View style={{paddingVertical: 5}}>
                              <Text
                                style={[styles.description]}
                                numberOfLines={1}>
                                {item.class_name} - {item.subtab_title}
                              </Text>
                            </View>
                          </View>
                          <View
                            style={{
                              paddingHorizontal: 10,
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                            {item.extension == 'pdf' ? (
                              <View style={styles.document}>
                                <Icon
                                  ComponentName={'Fontisto'}
                                  name={'acrobat-reader'}
                                  color={appColors.white}
                                  size={24}
                                />
                              </View>
                            ) : (
                              <View>
                                <Icon
                                  ComponentName={'FontAwesome'}
                                  name={'image'}
                                  color={appColors.themeBlue}
                                  size={width > 500 ? 40 : 30}
                                />
                              </View>
                            )}
                          </View>
                        </View>
                      </Pressable>
                    </View>
                  </View>
                );
              }}
              ListFooterComponent={
                <View style={{marginBottom: width < 500 ? 145 : 155}} />
              }
            />
          ) : (
            <ScrollView
              refreshControl={
                <RefreshControl onRefresh={onRefresh} refreshing={refresh} />
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
                Er zijn geen updates voor dit evenement
              </Text>
              <View style={{marginBottom: 70}}></View>
            </ScrollView>
          )}
        </View>
      ) : (
        <View
          style={{
            flex: 0.8,
            borderWidth: 4,
            borderColor: appColors.shimmer,
            borderRadius: 10,
            marginHorizontal: 5,
          }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <EventUpdatesShim />
          </ScrollView>
        </View>
      )}
    </>
  );
};

const {width, height} = Dimensions.get('screen');

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  time: {
    color: appColors.white,
    fontFamily: appFont.Lato_Bold,
    fontSize: fontScalling(1.8),
  },
  timeBack: {
    backgroundColor: appColors.themeBlue,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 5,
  },
  date: {
    color: appColors.textBlack,
    fontFamily: appFont.Lato_Regular,
    fontSize: fontScalling(1.4),
  },
  dot: {
    width: width > 500 ? width / 25 : width / 16,
    height: width > 500 ? width / 25 : width / 16,
    backgroundColor: appColors.themeRed,
    shadowColor: appColors.themeRed,
    borderRadius: 50,
    borderColor: appColors.shadowred,
    borderWidth: 5,
  },
  line: {
    borderColor: appColors.themeRed,
    width: 3,
    height: width > 500 ? width / 9 : width / 4.5,
    backgroundColor: appColors.themeRed,
    borderRadius: 30,
    marginTop: -10,
    position: 'absolute',
    top: 15,
    bottom: 0,
  },
  boxContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: appColors.white,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 10,
  },
  title: {
    color: appColors.textBlack,
    fontFamily: appFont.Lato_Bold,
    fontSize: fontScalling(1.8),
  },
  description: {
    color: appColors.textBlack,
    fontFamily: appFont.Lato_Regular,
    fontSize: fontScalling(1.6),
  },
  document: {
    backgroundColor: appColors.themeRed,
    borderRadius: 5,
    width: width > 500 ? width / 17 : width / 12.5,
    height: width > 500 ? width / 17 : width / 12.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
