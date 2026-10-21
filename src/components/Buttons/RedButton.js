import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {appColors} from '../../utilities/appColors';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {appFont} from '../../utilities/appFonts';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import {Icon} from '../../utilities/AppIcons';

export const RedButton = ({
  title,
  iconComp,
  iconName,
  iconColor,
  iconSize,
  onPress,
  blueback,
  ricomp,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        {backgroundColor: blueback ? appColors.themeBlue : appColors.themeRed},
      ]}>
      <View style={{flexDirection: 'row', alignItems: 'center',gap:10}}>
      {ricomp ? (
          <Icon
            ComponentName={ricomp}
            name={iconName}
            color={iconColor}
            size={iconSize}
          />
        ) : null}
        <Text style={styles.title}>{title} </Text>
        {iconComp ? (
          <Icon
            ComponentName={iconComp}
            name={iconName}
            color={iconColor}
            size={iconSize}
          />
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: appColors.themeRed,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  title: {
    color: appColors.white,
    fontFamily: appFont.Lato_Bold,
    fontSize: responsiveFontSize(1.8),
  },
});
