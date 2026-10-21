import {StyleSheet, Text, View, Dimensions} from 'react-native';
import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {appColors} from './appColors';

const {width, height} = Dimensions.get('screen');

export const NewsShim = () => {
  const {width, height} = Dimensions.get('window');
  return (
    <SkeletonPlaceholder>
      {[1, 2, 3, 4, 5, 6, 7, 8].map((val, index) => {
        return (
          <View
            key={index}
            style={{
              marginBottom: 10,
              padding: 10,
              height: width / 3.5,
              marginHorizontal: 20,
              borderWidth: 4,
              borderColor: appColors.shimmer,
              borderRadius: 10,
              justifyContent: 'space-between',
            }}>
            <View style={{width: '60%', height: '40%'}}></View>
            <View style={{width: '100%', height: '20%'}}></View>
            <View style={{width: '80%', height: '20%'}}></View>
          </View>
        );
      })}
    </SkeletonPlaceholder>
  );
};

export const EventShim = () => {
  return (
    <SkeletonPlaceholder>
      {[1, 2, 3, 4, 5, 6, 7, 8].map((_, i) => {
        return (
          <View
            key={i}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View
              style={{
                borderRadius: 100,
                height: width / 15,
                width: width / 15,
                marginRight: 10,
              }}
            />
            <View
              style={{
                flex: 1,
                width: '100%',
                height: width / 3.8,
                borderWidth: 4,
                borderColor: appColors.shimmer,
                borderRadius: 10,
                marginVertical: 8,
                padding: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View style={{height: '100%', width: '25%', borderRadius: 0}} />
              <View
                style={{
                  height: '100%',
                  width: '50%',
                  borderRadius: 0,
                }}>
                <View style={{width: '100%', height: '30%'}}></View>
                <View
                  style={{
                    width: '100%',
                    height: '20%',
                    marginVertical: 10,
                  }}></View>
                <View
                  style={{
                    width: '100%',
                    height: '20%',
                  }}></View>
              </View>
              <View
                style={{width: '20%', height: '100%', borderRadius: 0}}></View>
            </View>
          </View>
        );
      })}
    </SkeletonPlaceholder>
  );
};

export const EventClassShim = () => {
  return (
    <View
      style={{
        padding: 10,
      }}>
      <SkeletonPlaceholder>
        {[
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
          21, 22, 23, 24, 25, 26, 27,
        ].map((_, i) => {
          return (
            <View
              key={i}
              style={{
                height: width / 10,
                marginVertical: 5,
              }}></View>
          );
        })}
      </SkeletonPlaceholder>
    </View>
  );
};

export const EventUpdatesShim = () => {
  return (
    <View
      style={{
        padding: 5,
      }}>
      <SkeletonPlaceholder>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((_, i) => {
          return (
            <View
              key={i}
              style={{
                height: width / 5,
                marginVertical: 5,
                borderWidth: 4,
                padding: 5,
                borderColor: appColors.shimmer,
                borderRadius: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  width: '15%',
                  height: '100%',
                  justifyContent: 'space-between',
                }}>
                <View style={{height: '60%', width: '100%'}} />
                <View style={{height: '30%', width: '100%'}} />
              </View>
              <View
                style={{
                  width: '10%',
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    height: width / 15,
                    width: width / 15,
                    borderRadius: 1000,
                  }}
                />
              </View>
              <View
                style={{
                  width: '70%',
                  height: '100%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{
                    width: '40%',
                    height: '100%',
                  }}>
                  <View
                    style={{
                      height: '20%',
                      width: '100%',
                      marginBottom: 15,
                    }}></View>
                  <View style={{height: '20%', width: '100%'}}></View>
                </View>
                <View style={{width: '40%', height: '100%'}}></View>
              </View>
            </View>
          );
        })}
      </SkeletonPlaceholder>
    </View>
  );
};

export const EventPushNotificationShim = () => {
  return (
    <SkeletonPlaceholder>
      {[1, 2, 3, 4, 5, 6, 7, 8].map((_, i) => {
        return (
          <View
            key={i}
            style={{
              height: width / 4.5,
              marginVertical: 5,
              borderWidth: 4,
              padding: 5,
              borderColor: appColors.shimmer,
              borderRadius: 10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                width: '25%',
                height: '100%',
                justifyContent: 'space-between',
              }}></View>
            <View
              style={{
                width: '70%',
                height: '100%',
                justifyContent: 'space-around',
              }}>
              <View style={{width: '60%', height: '15%'}} />
              <View style={{width: '80%', height: '15%'}} />
              <View style={{width: '100%', height: '15%'}} />
            </View>
          </View>
        );
      })}
    </SkeletonPlaceholder>
  );
};

export const SettingCardsShim = () => {
  return (
    <SkeletonPlaceholder>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((_, i) => {
        return (
          <View
            key={i}
            style={{
              height: width / 4,
              marginVertical: 5,
              borderWidth: 4,
              padding: 5,
              borderColor: appColors.shimmer,
              borderRadius: 10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                width: '59%',
                height: '100%',
                justifyContent: 'space-between',
                flexDirection: 'row',
                paddingHorizontal: 5,
                paddingVertical: 5,
              }}>
              <View style={{width: '40%', height: '100%'}} />
              <View
                style={{
                  width: '60%',
                  height: '100%',
                  paddingHorizontal: 5,
                  paddingVertical: 5,
                  justifyContent: 'space-between',
                }}>
                {[1, 2, 3].map((_, j) => {
                  return (
                    <View key={j} style={{width: '100%', height: '20%'}} />
                  );
                })}
              </View>
            </View>
            <View
              style={{
                width: '40%',
                height: '100%',
                borderWidth: 4,
                borderColor: appColors.shimmer,
                borderRadius: 10,
                paddingVertical: 20,
                paddingHorizontal: 5,
                justifyContent: 'center',
              }}>
              {[1, 2].map((_, k) => {
                return (
                  <View
                    key={k}
                    style={{
                      width: '100%',
                      height: '30%',
                      marginVertical: 10,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <View style={{width: '50%', height: '100%'}} />
                    <View style={{width: '30%', height: '100%'}} />
                  </View>
                );
              })}
            </View>
          </View>
        );
      })}
    </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({});
