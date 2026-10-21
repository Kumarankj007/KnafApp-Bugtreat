import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import {appColors} from '../../utilities/appColors';
import {appFont} from '../../utilities/appFonts';
import {fontScalling} from '../../utilities/HelpeFunction';

export const BottomButtons = ({
  switchOne,
  switchTwo,
  switchThree,
  switchFour,
  onSelect,
  activeSwitch,
}) => {
  const [active, setActive] = useState(activeSwitch);
  const Switching = sno => {
    setActive(sno);
    onSelect(sno);
  };

  useEffect(() => {
    setActive(activeSwitch);
  }, [activeSwitch]);
  return (
    <View style={styles.container}>
      <View
        style={{
          borderRadius: 20,
          overflow: 'hidden',
          alignItems: 'center',
        }}>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}>
          <Pressable
            onPress={() => {
              Switching(1);
            }}
            style={[
              styles.buttons,
              {
                backgroundColor:
                  active == 1 ? appColors.themeBlue : appColors.white,
              },
            ]}>
            <Text
              style={[
                styles.text,
                {color: active == 1 ? appColors.white : appColors.textBlack},
              ]}>
              {switchOne}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              Switching(2);
            }}
            style={[
              styles.buttons,
              {
                backgroundColor:
                  active == 2 ? appColors.themeBlue : appColors.white,
              },
            ]}>
            <Text
              style={[
                styles.text,
                {color: active == 2 ? appColors.white : appColors.textBlack},
              ]}>
              {switchTwo}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              Switching(3);
            }}
            style={[
              styles.buttons,
              {
                backgroundColor:
                  active == 3 ? appColors.themeBlue : appColors.white,
              },
            ]}>
            <Text
              style={[
                styles.text,
                {color: active == 3 ? appColors.white : appColors.textBlack},
              ]}>
              {switchThree}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              Switching(4);
            }}
            style={[
              styles.buttons,
              {
                backgroundColor:
                  active == 4 ? appColors.themeBlue : appColors.white,
              },
            ]}>
            <Text
              style={[
                styles.text,
                {color: active == 4 ? appColors.white : appColors.textBlack},
              ]}>
              {switchFour}
            </Text>
          </Pressable>
        </ScrollView>
      </View>
    </View>
  );
};

const {width, height} = Dimensions.get('screen');

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: appColors.white,
    borderRadius: 20,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 5,
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  buttons: {
    backgroundColor: appColors.themeBlue,
    borderRadius: 20,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: width > 500 ? 25: 8,
  },
  text: {
    color: appColors.textWhite,
    fontFamily: appFont.Lato_Bold,
    fontSize: fontScalling(1.6),
  },
});
