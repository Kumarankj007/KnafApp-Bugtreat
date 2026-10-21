import React from 'react';
import {StyleSheet, View} from 'react-native';
import {appColors} from '../../utilities/appColors';

export const ThemeCard = ({children, altStyle = {}}) => {
  return <View style={[styles.container, altStyle]}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: appColors.white,
    // alignItems:'center',
    // justifyContent:'center',
    padding: 13,
    shadowColor: appColors.textBlack,
    elevation: 5,
    shadowOffset: 15,
    borderRadius: 5,
    marginVertical: 5,
    marginHorizontal: 15,
  },
});
