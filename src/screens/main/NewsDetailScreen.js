import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions
} from 'react-native';
import React from 'react';
import {appColors} from '../../utilities/appColors';
import {appFont} from '../../utilities/appFonts';
import {fontScalling} from '../../utilities/HelpeFunction';
import {RedButton} from '../../components/Buttons/RedButton';
import RenderHTML from 'react-native-render-html';

export default function NewsDetailScreen({route}) {
  const {description} = route.params;

  const {width} = useWindowDimensions();
  const newsDes = {html:`${description}`}
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}}>
      <View style={{paddingHorizontal:10, overflow:'hidden'}}>
        <RenderHTML 
          source={newsDes}
          width={width}
          tagsStyles={{
            body: {
              whiteSpace: 'normal',
              color: appColors.textBlack,
            }
          }}
        />
      </View>
      {/* <View style={{paddingHorizontal: 20, marginBottom: 10}}>
        <RedButton
          blueback={true}
          title={'Voorlopige registratielijst Superklasse'}
        />
      </View>
      <View style={{paddingHorizontal: 20, marginBottom: 10}}>
        <RedButton
          blueback={true}
          title={'Voorlopige registratielijst Sprintklasse 2000'}
        />
      </View>
      <View style={{paddingHorizontal: 20, marginBottom: 10}}>
        <RedButton
          blueback={true}
          title={'Voorlopige registratielijst Juniorbuggy'}
        />
      </View>
      <View style={{paddingHorizontal: 20, marginBottom: 10}}>
        <RedButton
          blueback={true}
          title={'Voorlopige registratielijst Sprintklasse 2000'}
        />
      </View> */}
      <View style={{marginBottom: 70}} />
    </ScrollView>
  );
}

const {width, height} = Dimensions.get('screen');

const styles = StyleSheet.create({
  image: {
    width: width,
    height: width / 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    paddingHorizontal: 20,
  },
  text: {
    color: appColors.textBlack,
    fontFamily: appFont.Lato_Regular,
    fontSize: fontScalling(1.8),
    lineHeight: 25,
    paddingBottom: 15,
  },
});
