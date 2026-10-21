import React, {useCallback, useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  Linking,
  LayoutAnimation,
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  RefreshControl,
  UIManager,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {appColors} from '../../utilities/appColors';
import {appFont} from '../../utilities/appFonts';
import {fontScalling, print} from '../../utilities/HelpeFunction';
import LottieView from 'lottie-react-native';
import * as Animatable from 'react-native-animatable';
import HtmlView from '../../components/html/HtmlView';
import {Icon} from '../../utilities/AppIcons';
import {url} from '../../utilities/appApi';
import {useToast} from 'react-native-toast-notifications';
import {useIsFocused} from '@react-navigation/native';
import {setSettingTrigger} from '../../redux/eventSettingSlice';
import AutoHeightWebView from 'react-native-autoheight-webview';

export const EventInfo = ({
  id,
  title,
  banner,
  description,
  live_url,
  textual_event,
  setTextualEvent,
  textual_description,
  fb = '',
  insta = '',
  twitter = '',
}) => {
  const {fcmToken, userAgent} = useSelector(state => state.settings);
  const toast = useToast();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const [eventInfo, setEventInfo] = useState({
    title: title,
    banner: banner,
    description: description,
    live_url: live_url,
    textual_event: textual_event,
    textual_description: textual_description,
    fb: fb,
    twitter: twitter,
    insta: insta,
  });

  const [poll, setPoll] = useState(-1);
  const [Polling, setPollings] = useState({});
  const [load, setLoad] = useState(false);
  const [infoLoad, setInfoLoad] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(1);

  //polling and update vote:
  const pollingApi = async (answer = '') => {
    if (fcmToken && userAgent && fcmToken != '' && userAgent != '') {
      try {
        if (Object.keys(Polling).length == 0) {
          setLoad(true);
        }
        const headers = new Headers();
        const formData = new FormData();

        headers.append('User-Agent', userAgent);

        formData.append('deviceid', fcmToken);
        formData.append('event_id', id);
        if (answer != '') {
          formData.append('answer', answer);
        }

        const response = await fetch(url().pollAndUpdate, {
          method: 'POST',
          body: formData,
          headers: headers,
        });
        // console.log(response, 'enter');
        const resparse = await response.json();
        if (response.status == 200) {
          if (resparse && resparse.response_message.status == 'success') {
            // console.log(JSON.stringify(resparse, undefined, 2), 'data');
            setPollings(resparse);
            setLoad(false);
            setRefresh(false);
            if (
              resparse.options &&
              resparse.options.length > 0 &&
              resparse.question &&
              resparse.question != '' &&
              resparse.response_message.message == 'Timeout'
            ) {
              toast.hideAll();
              toast.show(resparse.response_message.message, {
                type: 'warning',
                duration: 3000,
                offset: 30,
                placement: 'bottom',
                animationType: 'zoom-in',
                style: {
                  marginBottom: 60,
                },
              });
            }
          }
        } else {
          console.log('pollAndUpdate status code :', response.status);
          setLoad(false);
          // setRefresh(false);
        }
      } catch (error) {
        console.log('error occured in event push notification');
        setLoad(false);
        // setRefresh(false);
      }
    }
  };

  // pull to refresh:
  const eventHomeRefresh = async () => {
    if (userAgent && userAgent != '') {
      try {
        const headers = new Headers();
        const formData = new FormData();

        headers.append('User-Agent', userAgent);

        formData.append('eventid', id);

        const response = await fetch(url().eventHome, {
          method: 'POST',
          body: formData,
          headers: headers,
        });
        const resparse = await response.json();
        if (response.status == 200) {
          if (resparse) {
            // console.log(JSON.stringify(resparse, undefined, 2), 'data');
            setTextualEvent(resparse.data[0].textual_event);
            setEventInfo({
              title: resparse.data[0].title,
              banner: resparse.data[0].banner,
              description: resparse.data[0].description,
              live_url: resparse.data[0].live_url,
              textual_event: resparse.data[0].textual_event,
              textual_description: resparse.data[0].textual_description,
              fb: resparse.data[0].fb,
              twitter: resparse.data[0].twitter,
              insta: resparse.data[0].insta,
            });
            dispatch(setSettingTrigger());
          }
          setRefresh(false);
          setInfoLoad(false);
        } else {
          console.log('status code :', response.status);
          setRefresh(false);
          setInfoLoad(false);
        }
      } catch (error) {
        console.log('error occured in event push notification');
        setRefresh(false);
        setInfoLoad(false);
      }
    }
  };

  // initial polling api:
  useEffect(() => {
    if (isFocused) {
      eventHomeRefresh();
      pollingApi();
    }
  }, [isFocused]);

  // pull to refresh:
  const onRefresh = useCallback(() => {
    setRefresh(true);
  }, []);

  useEffect(() => {
    if (refresh) {
      eventHomeRefresh();
      pollingApi();
    }
  }, [refresh]);

  // console.log(live_url, 'des');

  // accordion
  // Enable LayoutAnimation Android
  if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
  }
  const [expandedSections, setExpandedSections] = useState(false);
  // const toggleSection = () => {
  //   LayoutAnimation.configureNext(
  //     LayoutAnimation.create(100, 'easeInEaseOut', 'opacity'),
  //   );
  //   setExpandedSections(!expandedSections);
  // };
  // Captilize the string
  const Capitalize = str => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  useEffect(() => {
    if (eventInfo.banner && eventInfo.banner != '') {
      Image.getSize(
        eventInfo.banner,
        (width, height) => {
          const aspectRatio = width / height;
          setAspectRatio(aspectRatio);
        },
        error => {
          console.log('Error in banner', error);
          setAspectRatio(0);
        },
      );
    }
  }, [eventInfo.banner]);

  const validIframe = htmlString => {
    // Array to store extracted iframe URLs
    const iframeUrls = [];

    // Start searching for `<iframe` tags
    let searchIndex = 0;

    while ((searchIndex = htmlString.indexOf('<iframe', searchIndex)) !== -1) {
      // Find the `src="` inside the iframe tag
      let srcIndex = htmlString.indexOf('src="', searchIndex);

      if (srcIndex !== -1) {
        // Move index past `src="`
        srcIndex += 5;

        // Find the closing quote `"`
        const srcEnd = htmlString.indexOf('"', srcIndex);

        // Extract the URL using substring()
        const extractedURL = htmlString.substring(srcIndex, srcEnd);

        // Store the extracted iframe URL
        iframeUrls.push(extractedURL);

        // Move searchIndex forward to find the next `<iframe>` tag
        searchIndex = srcEnd;
      }
    }

    // Output result
    return iframeUrls;
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: appColors.screenBg,
        position: 'relative',
      }}>
      {!infoLoad ? (
        <>
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 25}}
            style={{flex: 1}}>
            {eventInfo.banner &&
              eventInfo.banner != '' &&
              eventInfo.banner != undefined && (
                <View style={styles.imgcontainer}>
                  <Image
                    source={{uri: eventInfo.banner}}
                    resizeMode="contain"
                    style={[
                      aspectRatio != 0 && {aspectRatio: aspectRatio},
                      {
                        width: '100%',
                      },
                    ]}
                  />
                </View>
              )}
            {/* title & social */}
            <View style={{paddingHorizontal: 20, marginTop: 20}}>
              {eventInfo.title && eventInfo.title != '' && (
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={[styles.redText, {flex: 1, paddingRight: 10}]}>
                    {Capitalize(eventInfo.title)}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    {!eventInfo.fb == '' && eventInfo.fb != null && (
                      <Pressable
                        style={{padding: 3, paddingLeft: 0}}
                        onPress={() => Linking.openURL(fb)}>
                        <Icon
                          ComponentName={'Entypo'}
                          name="facebook-with-circle"
                          color={appColors.themeBlue}
                          size={width > 500 ? 30 : 35}
                        />
                      </Pressable>
                    )}
                    {!eventInfo.twitter == '' && eventInfo.twitter != null && (
                      <Pressable
                        style={{
                          padding: width > 500 ? 7 : 8,
                          marginRight: 3,
                          backgroundColor: appColors.themeBlue,
                          borderRadius: 50,
                        }}
                        onPress={() => Linking.openURL(twitter)}>
                        <Icon
                          ComponentName={'FontAwesome6'}
                          name="x-twitter"
                          color={appColors.white}
                          size={width > 500 ? 15 : 17}
                        />
                      </Pressable>
                    )}
                    {!eventInfo.insta == '' && eventInfo.insta != null && (
                      <Pressable
                        style={{padding: 3, paddingLeft: 0}}
                        onPress={() => Linking.openURL(insta)}>
                        <Icon
                          ComponentName={'Entypo'}
                          name="instagram-with-circle"
                          color={appColors.themeBlue}
                          size={width > 500 ? 31 : 35}
                        />
                      </Pressable>
                    )}
                  </View>
                </View>
              )}
            </View>
            {/* Polling */}
            {!load ? (
              <>
                {Polling &&
                  Polling.poll_status &&
                  Object.keys(Polling).length > 0 &&
                  (Polling.poll_start || Polling.poll_end) && (
                    <>
                      {Polling.options &&
                        Polling.options.length > 0 &&
                        Polling.question &&
                        Polling.question != '' && (
                          <>
                            <View
                              style={{paddingHorizontal: 20, marginTop: 15}}>
                              {/* questions */}
                              <Pressable
                                onPress={() =>
                                  setExpandedSections(!expandedSections)
                                }
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  padding: 8,
                                  borderRadius: 8,
                                  borderWidth: 3,
                                  borderColor: appColors.themeRed,
                                  marginTop: 5,
                                  marginBottom: 10,
                                }}>
                                <Text
                                  style={[
                                    styles.redText,
                                    {
                                      color: appColors.textBlack,
                                      lineHeight: fontScalling(2.5),
                                    },
                                  ]}>
                                  {Polling.question}
                                </Text>
                                <View
                                  style={{
                                    transform: [
                                      {
                                        rotateZ: expandedSections
                                          ? '90deg'
                                          : '-90deg',
                                      },
                                    ],
                                  }}>
                                  <Icon
                                    ComponentName={'MaterialIcons'}
                                    name={'arrow-back-ios-new'}
                                    size={width < 500 ? 18 : 25}
                                    color={appColors.textBlack}
                                  />
                                </View>
                              </Pressable>
                              {expandedSections && (
                                <>
                                  {/* description */}
                                  {Polling.poll_desc && (
                                    <HtmlView url={Polling.poll_desc} />
                                  )}
                                  <View
                                    style={{
                                      paddingHorizontal: 10,
                                      marginVertical: 10,
                                    }}>
                                    {/* radio btn */}
                                    {Polling.poll && Polling.poll_start && (
                                      <View>
                                        {Polling.options.length > 0 && (
                                          <>
                                            {Polling.options.map(
                                              (data, index) => {
                                                return (
                                                  <Pressable
                                                    key={index}
                                                    style={{
                                                      flexDirection: 'row',
                                                      alignItems: 'center',
                                                      marginBottom: 20,
                                                    }}
                                                    onPress={() => {
                                                      if (poll == -1) {
                                                        setPoll(index);
                                                        pollingApi(data.name);
                                                      }
                                                    }}>
                                                    {/* radio btn */}
                                                    <View
                                                      style={{
                                                        borderRadius: 100,
                                                        marginRight: 7,
                                                        width:
                                                          width > 500 ? 20 : 18,
                                                        height:
                                                          width > 500 ? 20 : 18,
                                                        borderWidth: 2,
                                                        borderColor:
                                                          appColors.themeBlue,
                                                        alignItems: 'center',
                                                        justifyContent:
                                                          'center',
                                                      }}>
                                                      <View
                                                        style={{
                                                          width:
                                                            width > 500
                                                              ? 13
                                                              : 10,
                                                          height:
                                                            width > 500
                                                              ? 13
                                                              : 10,
                                                          borderRadius: 100,
                                                          backgroundColor:
                                                            poll == index
                                                              ? appColors.themeBlue
                                                              : 'transparent',
                                                        }}
                                                      />
                                                    </View>
                                                    {/* option */}
                                                    <Text
                                                      style={
                                                        styles.description
                                                      }>
                                                      {data.name}
                                                    </Text>
                                                  </Pressable>
                                                );
                                              },
                                            )}
                                          </>
                                        )}
                                      </View>
                                    )}
                                    {/* result */}
                                    {(!Polling.poll || Polling.poll_end) && (
                                      <View>
                                        {Polling.options.length > 0 && (
                                          <>
                                            {Polling.options.map(
                                              (data, index) => {
                                                return (
                                                  <View key={index}>
                                                    <View
                                                      style={{
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        justifyContent:
                                                          'space-between',
                                                        marginBottom: 10,
                                                        paddingHorizontal: 5,
                                                      }}>
                                                      <Text
                                                        style={
                                                          styles.description
                                                        }>
                                                        {data?.name}
                                                      </Text>
                                                      <Text
                                                        style={
                                                          styles.description
                                                        }>
                                                        {data?.count} Votes
                                                      </Text>
                                                    </View>
                                                    {/* percentage bar */}
                                                    <View
                                                      style={{
                                                        width: '100%',
                                                        height:
                                                          width > 500 ? 35 : 25,
                                                        borderRadius: 50,
                                                        justifyContent:
                                                          'flex-start',
                                                        overflow: 'hidden',
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        marginBottom: 15,
                                                        backgroundColor:
                                                          appColors.grayBlack,
                                                      }}>
                                                      <View
                                                        style={{
                                                          width:
                                                            data.percentage,
                                                          alignItems: 'center',
                                                          borderRadius: 100,
                                                          justifyContent:
                                                            'center',
                                                          height: '100%',
                                                          backgroundColor:
                                                            appColors.themeRed,
                                                        }}></View>
                                                      <Text
                                                        style={[
                                                          styles.description,
                                                          {
                                                            position:
                                                              'absolute',
                                                            right: 0,
                                                            paddingHorizontal: 9,
                                                            fontSize:
                                                              fontScalling(1.6),
                                                            color:
                                                              appColors.textWhite,
                                                          },
                                                        ]}>
                                                        {data.percentage}
                                                      </Text>
                                                    </View>
                                                  </View>
                                                );
                                              },
                                            )}
                                          </>
                                        )}
                                        {Polling.total_count > 0 && (
                                          <Text
                                            style={{
                                              marginTop: 10,
                                              color: appColors.textBlack,
                                              fontFamily: appFont.Lato_Regular,
                                              fontSize: fontScalling(1.8),
                                            }}>
                                            Aantal keer gestemd:{'  '}
                                            <Text
                                              style={{
                                                color: appColors.themeRed,
                                                fontFamily: appFont.Lato_Bold,
                                              }}>
                                              {Polling.total_count}
                                            </Text>
                                          </Text>
                                        )}
                                      </View>
                                    )}
                                  </View>
                                </>
                              )}
                            </View>
                          </>
                        )}
                    </>
                  )}
              </>
            ) : (
              <></>
              // <ActivityIndicator size={'large'} color={appColors.themeRed} />
            )}
            {/* html content */}
            <View
              style={{
                marginVertical: 10,
                width: '100%',
                alignItems: 'center',
              }}>
              {eventInfo.textual_event == '1' ? (
                <View>
                  {eventInfo.textual_description != undefined &&
                    eventInfo.textual_description.trim() != '' && (
                      <>
                        {validIframe(eventInfo.textual_description) &&
                        validIframe(eventInfo.textual_description).length >
                          0 ? (
                          validIframe(eventInfo.textual_description).map(
                            (data, i) => (
                              <AutoHeightWebView
                                key={i}
                                scrollEnabled={false}
                                bounces={false}
                                source={{
                                  uri: data,
                                }}
                              />
                            ),
                          )
                        ) : (
                          <HtmlView
                            url={eventInfo.textual_description.trim()}
                          />
                        )}
                      </>
                    )}
                </View>
              ) : (
                <>
                  {eventInfo.description != undefined &&
                    eventInfo.description.trim() != '' && (
                      <>
                        {validIframe(eventInfo.description) &&
                        validIframe(eventInfo.description).length > 0 ? (
                          validIframe(eventInfo.description).map((data, i) => (
                            <AutoHeightWebView
                              key={i}
                              scrollEnabled={false}
                              bounces={false}
                              source={{
                                uri: data,
                              }}
                            />
                          ))
                        ) : (
                          <HtmlView url={eventInfo.description.trim()} />
                        )}
                      </>
                      // <HtmlView url={eventInfo.description.trim()} />
                    )}
                </>
              )}
            </View>
          </ScrollView>
          <View style={{position: 'relative'}}>
            {eventInfo.live_url && eventInfo.live_url != '' && (
              <Pressable
                onPress={() => Linking.openURL(eventInfo.live_url)}
                style={styles.liveStream}>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    width: width / 7,
                    height: width / 7,
                  }}>
                  <View
                    style={{
                      width: width / 7,
                      height: width / 7,
                      backgroundColor: appColors.themeRed,
                      borderRadius: width / 14,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: 2.5,
                      borderColor: appColors.white,
                    }}>
                    <LottieView
                      resizeMode="contain"
                      style={{
                        width: '100%',
                        height: width / 4,
                      }}
                      source={require('../../../assets/Images/lottieView/liveStream.json')}
                      autoPlay={true}
                      loop={true}
                    />
                  </View>
                  <Image
                    resizeMode="contain"
                    style={[
                      {
                        width: width / 9,
                        position: 'absolute',
                        bottom: width < 500 ? '-45%' : '-30%',
                      },
                      {transform: [{rotate: '-5deg'}]},
                    ]}
                    source={require('../../../assets/Images/liveStreamText.png')}
                  />
                </View>
              </Pressable>
            )}
          </View>
          <View
            style={{
              marginBottom:
                eventInfo.textual_event == '1' ? 75 : width < 500 ? 145 : 155,
            }}
          />
        </>
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor: appColors.screenBg,

            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: width < 500 ? 145 : 155,
          }}>
          <ActivityIndicator size={'large'} color={appColors.themeRed} />
        </View>
      )}
    </View>
  );
};

const {width, height} = Dimensions.get('screen');

const styles = StyleSheet.create({
  imgcontainer: {
    // maxWidth: width,
    // maxHeight: width / 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  redText: {
    color: appColors.themeRed,
    fontFamily: appFont.Lato_Regular,
    fontSize: fontScalling(2.2),
  },
  description: {
    color: appColors.textBlack,
    fontFamily: appFont.Lato_Regular,
    fontSize: fontScalling(1.8),
  },
  liveStream: {
    width: width / 5,
    height: width / 5,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 1000,
    bottom: width <= 375 ? '30%' : width > 500 ? '19%' : '23%',
    right: '5%',
  },
});
