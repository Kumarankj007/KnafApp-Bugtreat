import React, {useEffect, useState} from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  View,
  Text,
  RefreshControl,
  Dimensions,
} from 'react-native';
import {klasses} from '../../utilities/dummyData';
import {RedButton} from '../../components/Buttons/RedButton';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {setTitle} from '../../redux/TitleSlice';
import {url} from '../../utilities/appApi';
import {EventClassShim} from '../../utilities/appShimmer';
import {appColors} from '../../utilities/appColors';
import {appFont} from '../../utilities/appFonts';
import {fontScalling} from '../../utilities/HelpeFunction';

export const EventClasses = ({load, classes, onRefresh, refresh, event_id}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {width, height} = Dimensions.get('screen');
  // console.log(JSON.stringify(classes, undefined, 4), 'classes');
  return (
    <>
      {!load ? (
        <View style={{flex: 1, paddingHorizontal: 20}}>
          {classes && classes.length > 0 ? (
            <FlatList
              refreshControl={
                <RefreshControl onRefresh={onRefresh} refreshing={refresh} />
              }
              data={classes}
              style={{flex: 1}}
              showsVerticalScrollIndicator={false}
              keyExtractor={({id}) => id.toString()}
              renderItem={({item}) => {
                return (
                  <View style={{paddingBottom: 10}}>
                    <RedButton
                      subtabs={item.subtabs}
                      title={item.class_name}
                      onPress={() => {
                        dispatch(setTitle(item.class_name));
                        navigation.navigate('classDetails', {
                          subtabs: item.subtabs,
                          id: item.id,
                          classId: item.class_id,
                          eventId: item.event_id,
                          class_desc: item.class_desc,
                          pushnotification: item.pushnotification,
                        });
                      }}
                    />
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
                Er zijn geen klassen voor dit evenement
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
            marginHorizontal: 10,
          }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <EventClassShim />
          </ScrollView>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({});
