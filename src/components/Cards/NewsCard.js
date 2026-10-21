import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import React, {useState} from 'react';
import {appColors} from '../../utilities/appColors';
import {appFont} from '../../utilities/appFonts';
import {fontScalling} from '../../utilities/HelpeFunction';
import RenderHTML from 'react-native-render-html';

const NewsCard = ({item, onPress, ind}) => {
  const {width} = useWindowDimensions();
  const [active, setActive] = useState(false);

  const description = {html: `${item.description}`};

  return (
    <Pressable
      key={ind}
      style={[
        styles.boxContainer,
        {backgroundColor: active ? appColors.themeBlue : appColors.white},
      ]}
      onPressIn={() => {
        setActive(true);
      }}
      onPressOut={() => {
        setActive(false);
      }}
      onPress={onPress}>
      <View>
        <Text
          style={[
            styles.title,
            {color: active ? appColors.white : appColors.textBlack},
          ]}>
          {item.title}
        </Text>
        {/* <View numberOfLines={1} style={[styles.des,{color:active? appColors.white:appColors.textBlack}]}>
        <RenderHTML 
          contentWidth={width}
          source={description}
          tagsStyles={{
            body: {
              whiteSpace: 'normal',
              color: appColors.textBlack,
            }
          }}
        />
        </View> */}
        {item.short_description && (
          <Text
            numberOfLines={1}
            style={[
              styles.des,
              {color: active ? appColors.white : appColors.textBlack},
            ]}>
            {item.short_description}
          </Text>
        )}
        <Text style={styles.redTExt}>{item.pubDate} uur</Text>
      </View>
    </Pressable>
  );
};

export default NewsCard;

const styles = StyleSheet.create({
  title: {
    color: appColors.textBlack,
    fontFamily: appFont.Lato_Bold,
    fontSize: fontScalling(1.8),
    paddingBottom: 10,
  },
  des: {
    color: appColors.textBlack,
    fontFamily: appFont.Lato_Regular,
    fontSize: fontScalling(1.8),
    paddingBottom: 10,
  },
  redTExt: {
    color: appColors.themeRed,
    fontFamily: appFont.Lato_Regular,
    fontSize: fontScalling(1.6),
  },
  boxContainer: {
    backgroundColor: appColors.white,
    // alignItems:'center',
    // justifyContent:'center',
    padding: 15,
    shadowColor: appColors.textBlack,
    elevation: 5,
    shadowOffset: 15,
    borderRadius: 5,
    marginVertical: 5,
  },
});
