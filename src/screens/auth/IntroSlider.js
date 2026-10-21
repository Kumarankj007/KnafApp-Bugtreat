import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  ImageBackground,
  ScrollView,
  Pressable,
  Text,
  Dimensions,
  Image,
  FlatList,
  StyleSheet,
} from 'react-native';
import {appColors} from '../../utilities/appColors';
import {appFont} from '../../utilities/appFonts';
import {fontScalling} from '../../utilities/HelpeFunction';
import {Sliders} from '../../utilities/dummyData';
import LinearGradient from 'react-native-linear-gradient';
import {RedButton} from '../../components/Buttons/RedButton';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import {setLoggedIn, setLoginStatus} from '../../redux/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';

const {width, height} = Dimensions.get('screen');

export default function IntroSlider() {
  const flatListRef = useRef();
  const [activeIndex, setActiveIndex] = useState(0);
  const [slider, setIntrosliders] = useState([]);

  const {sliderContent} = useSelector(state => state.settings);
  // console.log(JSON.stringify(sliderContent, undefined, 2), 'slider');

  useEffect(() => {
    setIntrosliders(sliderContent);
    SystemNavigationBar.stickyImmersive();
  }, [sliderContent]);

  // background image Load:
  useEffect(() => {
    if (slider?.length > 0) {
      slider?.map((data, i) => {
        Image.prefetch(data.image).catch(e => console.log(e, 'error'));
      });
    }
  }, [slider]);

  const dispatch = useDispatch();

  // Render Dot Indicators
  const renderDotIndicators = () => {
    return slider.map((dot, index) => {
      if (slider.length > 1) {
        if (activeIndex === index) {
          return (
            <View
              key={index}
              style={{
                backgroundColor: appColors.white,
                height: 5,
                width: 18,
                marginHorizontal: 2,
                borderRadius: 10,
                opacity: 2,
                alignItems: 'center',
              }}></View>
          );
        } else {
          return (
            <View
              key={index}
              style={{
                backgroundColor: appColors.white,
                height: 5,
                width: 5,
                marginHorizontal: 2,
                borderRadius: 5,
                opacity: 1,
              }}></View>
          );
        }
      }
    });
  };

  //RenderImages
  const renderImages = ({item, index}) => {
    // stores the last slide
    const isLastSlide = index === slider.length - 1;
    return (
      <>
        <Pressable
          key={index}
          style={{
            flex: 1,
            width: width,
            height: height,
            backgroundColor: appColors.DarkBlue,
          }}>
          <ImageBackground
            width={width}
            height={height}
            source={{uri: item.image}}
            resizeMode="cover"
            style={{
              height: height,
              // width: width,
              justifyContent: 'flex-end',
              alignItems: 'center',
              paddingHorizontal: 18,
              flex: 1,
            }}>
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,1)']}
              start={{x: 0.5, y: 0.6}}
              end={{x: 0.5, y: 0.9}}
              style={{width: width, height: height}}>
              <View
                style={{
                  height: height,
                  paddingHorizontal: 18,
                  // width: width,
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  flex: 1,
                }}>
                <View style={{marginBottom: '18%', zIndex: 10000}}>
                  <Text style={styles.Heading}>{item.content}</Text>

                  <View style={styles.btnAdjustMent}>
                    {item.button_text &&
                      item?.button_text?.trim() != '' &&(
                        <RedButton
                          title={item.button_text}
                          iconColor={appColors.white}
                          iconComp={'AntDesign'}
                          iconName={'doubleright'}
                          iconSize={18}
                          onPress={() => {
                            dispatch(setLoggedIn('testing'));
                            (async () => {
                              await AsyncStorage.setItem(
                                'loginStatus',
                                JSON.stringify(true),
                              );
                            })();
                            setTimeout(() => {
                              dispatch(setLoginStatus(true));
                            }, 600);
                          }}
                        />
                      )}
                  </View>
                </View>
              </View>
            </LinearGradient>
          </ImageBackground>
        </Pressable>
      </>
    );
  };

  const handleScroll = event => {
    // Get the scroll position
    const scrollPosition = Math.ceil(event.nativeEvent.contentOffset.x);

    // Get the index of current active item
    const index = Math.round(scrollPosition / width);
    setActiveIndex(index);
  };

  const getItemLayout = (data, index) => ({
    length: width,
    offset: width * index,
    index: index,
  });

  return (
    <View style={styles.Container}>
      {slider?.length > 0 && (
        <>
          <FlatList
            ref={flatListRef}
            data={slider}
            renderItem={renderImages}
            pagingEnabled={true}
            horizontal={true}
            onScroll={handleScroll}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index}
            scrollEnabled={true}
            getItemLayout={getItemLayout}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              // position: 'absolute',
              // bottom: 0,
              zIndex: 100,
              marginVertical: 10,
              position: 'absolute',
              bottom: 25,
            }}>
            {renderDotIndicators()}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
  },
  Heading: {
    fontFamily: appFont.rB,
    color: appColors.white,
    fontSize: fontScalling(3.7),
    textAlign: 'center',
  },
  btnAdjustMent: {
    paddingVertical: 10,
    paddingBottom: 25,
  },
});
