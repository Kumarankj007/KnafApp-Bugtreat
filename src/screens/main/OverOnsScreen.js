import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import React from 'react';
import {appColors} from '../../utilities/appColors';
import {appFont} from '../../utilities/appFonts';
import {fontScalling} from '../../utilities/HelpeFunction';
import {useDispatch, useSelector} from 'react-redux';
import RenderHTML from 'react-native-render-html';

export default function OverOnsScreen() {
  const {infoContent} = useSelector(state => state.settings);

  const {width} = useWindowDimensions();
  const pageContent = {html: `${infoContent.overons[0].page_content}`};

  return (
    <>
      {infoContent && Object.keys(infoContent).length > 0 && (
        <FlatList
          keyExtractor={item => item.id}
          data={infoContent.overons}
          renderItem={({item}) => {
            return (
              <>
                <View>
                  <View
                    style={[
                      styles.image,
                      {
                        backgroundColor: item.overons_image
                          ? 'transparent'
                          : appColors.grayBlack,
                      },
                    ]}>
                    {item.overons_image && (
                      <Image
                        source={{uri: item.overons_image}}
                        resizeMode="contain"
                        style={{width: '100%', height: '100%'}}
                      />
                    )}
                  </View>
                </View>
                <View style={{paddingHorizontal: 20}}>
                  <RenderHTML
                    width={width}
                    source={pageContent}
                    tagsStyles={{
                      body: {
                        color: appColors.textBlack,
                        fontFamily: appFont.Lato_Regular,
                      },
                    }}
                  />
                  {/* <Text style={styles.des}>{item.page_content}</Text> */}
                </View>
                <View style={{marginBottom: 80}} />
              </>
            );
          }}
        />
      )}
    </>
  );
}

const {width, height} = Dimensions.get('screen');

const styles = StyleSheet.create({
  image: {
    width: width,
    height: height / 5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
  },
  heading: {
    color: appColors.textBlack,
    fontFamily: appFont.Lato_Bold,
    fontSize: fontScalling(2.5),
  },
  des: {
    fontFamily: appFont.Lato_Regular,
    color: appColors.textBlack,
    fontSize: fontScalling(1.8),
    lineHeight: 25,
  },
});
