import {StyleSheet, Text, View, TouchableOpacity, Dimensions} from 'react-native';
import React from 'react';
import { appColors } from '../../utilities/appColors';
import { appFont } from '../../utilities/appFonts';
import { fontScalling } from '../../utilities/HelpeFunction';

const CustomCheckbox = ({keyValue, value, onpress}) => {
  return (
    <>
    <View style={styles.checkBox}>
      <TouchableOpacity
        style={[styles.CheckContainer, {backgroundColor: value.checked != 0? appColors.themeRed : appColors.themeBlue, borderColor: value.checked != 0? appColors.themeRed : appColors.themeBlue}]}
        onPress={()=>onpress(keyValue)}
      >
        <Text
          style={{
            color: appColors.white,
            fontFamily: appFont.Lato_Regular,
            fontSize: fontScalling(1.7),
            textAlign: 'center',
          }}>
            {value.category}
        </Text>
      </TouchableOpacity>
    </View>
    </>
    
  );
};

export default CustomCheckbox;

const windowWidth = Dimensions.get('window').width;
const buttonWidth = (windowWidth - 50) / 2;

const styles = StyleSheet.create({
  checkBox: {
    width: buttonWidth,
    marginBottom: 7
  },
  CheckContainer:{
    paddingVertical: 7,
    borderWidth: 1,
    // borderColor: appColors.themeBlue,
    // backgroundColor: appColors.themeBlue,
    width: '100%',
    borderRadius: 3,
  }
});
