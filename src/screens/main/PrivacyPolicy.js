import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {appColors} from '../../utilities/appColors';
import {appFont} from '../../utilities/appFonts';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import {Icon} from '../../utilities/AppIcons';
import { fontScalling } from '../../utilities/HelpeFunction';
import {useSelector} from 'react-redux';

export default function PrivacyPolicy() {

  const {infoContent} = useSelector(state => state.settings);
  const privacyContent = infoContent.Privacy_policy[0];
  return (
    <View style={{flex: 1}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          flex: 1,
          paddingHorizontal: 15,
        }}>
        <View style={{paddingVertical: 10}}>
            <Text style={styles.description}>{privacyContent.content}</Text>
          </View>
        <View style={{paddingBottom:80}} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    color: appColors.textBlack,
    fontFamily: appFont.Lato_Bold,
    fontSize: fontScalling(2.5),
  },
  sideHeadings: {
    color: appColors.textBlack,
    fontFamily: appFont.Lato_Bold,
    fontSize: fontScalling(1.8),
  },
  description: {
    color: appColors.textBlack,
    fontFamily: appFont.Lato_Regular,
    fontSize: fontScalling(1.8),
  },
});
