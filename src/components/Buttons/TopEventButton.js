import React, {useState} from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import {appColors} from '../../utilities/appColors';
import {appFont} from '../../utilities/appFonts';
import {fontScalling} from '../../utilities/HelpeFunction';

export const TopEventButton = ({
  switchOne,
  switchTwo,
  onSelect,
  activeSwitch,
}) => {
  const [active, setActive] = useState(activeSwitch);
  const Switching = sno => {
    setActive(sno);
    onSelect(sno);
  };

  return (
    <View style={styles.container}>
      <Pressable 
       onPress={() =>{
        Switching(1);
       }}
       style={[styles.buttons,{backgroundColor: active == 1 ? appColors.themeBlue : appColors.white}]}
       >
        <Text style={[styles.text,{color: active == 1 ? appColors.white : appColors.textBlack}]}>{switchOne}</Text>
      </Pressable>
      <Pressable 
        onPress={() =>{
            Switching(2)
        }}
        style={[styles.buttons,{backgroundColor: active == 2 ? appColors.themeBlue : appColors.white}]}
        >
        <Text style={[styles.text,{color: active == 2 ? appColors.white : appColors.textBlack}]}>{switchTwo}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: appColors.white,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 5,
  },
  buttons: {
    backgroundColor: appColors.themeBlue,
    borderRadius: 15,
    width: '50%',
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  text: {
    color: appColors.textWhite,
    fontFamily: appFont.Lato_Bold,
    fontSize: fontScalling(1.8),
  },
});
