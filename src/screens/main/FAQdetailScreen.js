import {FlatList, StyleSheet, Text, View, Dimensions} from 'react-native';
import React, {useEffect, useState} from 'react';
import {ThemeCard} from '../../components/Cards/ThemeCard';
import {appColors} from '../../utilities/appColors';
import {appFont} from '../../utilities/appFonts';
import {fontScalling} from '../../utilities/HelpeFunction';
import {brand} from '../../utilities/dummyData';
import {Icon} from '../../utilities/AppIcons';
import HtmlView from '../../components/html/HtmlView';

const {width, height} = Dimensions.get('screen');

export default function FAQdetailScreen({route}) {
  const {category} = route.params;
  return (
    <View style={{flex: 1}}>
      <FlatList
        keyExtractor={(item, index) => index}
        showsVerticalScrollIndicator={false}
        data={category}
        renderItem={({item}) => {
          return (
            <View style={{flex: 1}}>
              <ThemeCard
                children={
                  <View>
                    <Text style={styles.headings}>{item.title}</Text>
                    <View style={{marginTop: 0}}>
                      <HtmlView
                        url={item.content.trim()}
                        propswidth={width - 70}
                      />
                    </View>
                  </View>
                }
              />
            </View>
          );
        }}
      />
      <View style={{marginBottom: 70}} />
    </View>
  );
}

const styles = StyleSheet.create({
  headings: {
    color: appColors.textBlack,
    fontFamily: appFont.Lato_Bold,
    fontSize: fontScalling(2.5),
  },
  thinText: {
    color: appColors.textBlack,
    fontFamily: appFont.Lato_Regular,
    fontSize: fontScalling(1.8),
  },
  boldText: {
    color: appColors.textBlack,
    fontFamily: appFont.Lato_Bold,
    fontSize: fontScalling(1.8),
  },
});
