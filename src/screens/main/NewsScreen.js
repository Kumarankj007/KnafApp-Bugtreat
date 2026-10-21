import React, {useEffect, useState, useRef, useMemo, useCallback} from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  Touchable,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
} from 'react-native';
import {newsData} from '../../utilities/dummyData';
import {ThemeCard} from '../../components/Cards/ThemeCard';
import {appColors} from '../../utilities/appColors';
import {appFont} from '../../utilities/appFonts';
import {fontScalling, print} from '../../utilities/HelpeFunction';
import {useDispatch, useSelector} from 'react-redux';
import {setNewsTitle} from '../../redux/TitleSlice';
import NewsCard from '../../components/Cards/NewsCard';
import {useNavigation} from '@react-navigation/native';
import {AppHeader} from '../../components/AppHeader/AppHeader';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {
  BottomSheetModalProvider,
  BottomSheetBackdrop,
  BottomSheetFooter,
  BottomSheetModal,
} from '@gorhom/bottom-sheet';
import CustomCheckbox from '../../components/Cards/CustomCheckbox';
import {useIsFocused} from '@react-navigation/native';
import {url} from '../../utilities/appApi';
import {NewsShim} from '../../utilities/appShimmer';

const {width, height} = Dimensions.get('window');

export default function NewsScreen() {
  const [news, setnews] = useState({
    data: [],
    start: 0,
    limit: 0,
    count: 0,
    page: 0,
    filter: [],
  });
  const [newsStart, setNewsStart] = useState(0);
  const [filter, setfilter] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterOpen, setFilteOpen] = useState(false);
  const [refreshControll, setRefreshControll] = useState(false);

  const {userAgent} = useSelector(state => state.settings);
  const navigation = useNavigation();
  const filterapply = useRef('');
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ['45%'], []);

  // onRefresh
  const onRefresh = useCallback(() => {
    setnews(preData => {
      return {
        data: preData.data,
        start: 0,
        limit: 10,
        count: 0,
        page: 0,
        filter: news.filter,
      };
    });
    setNewsStart(0);
    setRefreshControll(true);
  }, []);

  // bottom sheet onpress function
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
    setFilteOpen(true);
  }, []);

  // bottom sheet close function
  const handleCloseModalPress = useCallback(() => {
    bottomSheetModalRef.current.close();
    setFilteOpen(false);
  }, []);

  const handleSheetChanges = useCallback(index => {
    if (index == -1) {
      setFilteOpen(false);
    }
  }, []);

  useEffect(() => {
    if (!isFocused) {
      handleCloseModalPress();
    }
  }, [isFocused]);

  //bottomsheet backdrop component
  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={1}
        enableTouchThrough={true}
        pressBehavior={'close'}
      />
    ),
    [],
  );

  const triggerNews = async () => {
    if (userAgent && userAgent != '') {
      try {
        if (!refreshControll) {
          news.data.length == 0 ? setLoading(true) : setLoading(false);
        }
        const headers = new Headers();
        const formData = new FormData();

        headers.append('User-Agent', userAgent);
        if (news.filter.length > 0) {
          const checkedCat = news.filter
            .filter(item => item.checked === 1)
            .map(item => item.id);
          filterapply.current = checkedCat.join(',');
        }

        formData.append('start', newsStart);

        if (filterapply.current != '') {
          formData.append('cat_id', filterapply.current);
        }
        // print(formData,'formData')
        const response = await fetch(url().newsFeed, {
          method: 'POST',
          body: formData,
          headers: headers,
        });
        
        // print(response,'response')
        if (response.status == 200) {
          const resparse = await response.json();
          // print(resparse,'resparse----');
          if (resparse.status == 'success') {
            if (resparse.data) {
              setnews(news => ({
                data: refreshControll
                  ? resparse.data
                  : [...news.data, ...resparse.data],
                start: Number(resparse.start),
                limit: Number(resparse.limit),
                count: Number(resparse.count),
                page: Number(news.page) + 1,
                filter: resparse.filter,
              }));
              setRefreshControll(false);
              setLoading(false);
            } else {
              console.log('there is no data');
              setRefreshControll(false);
              setLoading(false);
            }
          } else {
            setRefreshControll(false);
            setLoading(false);
            console.log('there is no');
          }
        } else {
          console.log('status_code:', response.status);
          setRefreshControll(false);
          setLoading(false);
        }
      } catch (error) {
        console.log('error occurred in news screen');
        setRefreshControll(false);
        setLoading(false);
      }
    }
  };
  // console.log(JSON.stringify(news, undefined, 2), 'page');

  useEffect(() => {
    if (!refreshControll) {
      triggerNews();
    }
  }, [newsStart]);

  useEffect(() => {
    if (refreshControll) {
      triggerNews();
    }
  }, [refreshControll]);

  const paging = () => {
    setNewsStart(Number(news.start) + Number(news.limit));
  };

  const selectFilter = (value, key) => {
    setnews(obj => {
      obj.filter[key] = value;
      return {...obj};
    });
  };

  //clear function
  const clearFunction = () => {
    setnews(topics => {
      let filter = topics.filter.map(val => ({
        ...val,
        checked: 0,
      }));
      return {...topics, filter: [...filter]};
    });
  };

  // footer for filter bottomsheet
  const renderFooter = useCallback(
    props => {
      return (
        <BottomSheetFooter {...props} bottomInset={0}>
          <View
            style={{
              width: width,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: appColors.white,
              marginBottom: 70,
            }}>
            <TouchableOpacity
              style={{
                paddingVertical: 8,
                paddingHorizontal: 25,
                backgroundColor: appColors.themeRed,
                borderRadius: 20,
                marginVertical: 15,
              }}
              onPress={() => {
                setnews({
                  data: [],
                  start: 0,
                  limit: 10,
                  count: 0,
                  page: 0,
                  filter: news.filter,
                });
                if (newsStart == 0) {
                  triggerNews();
                } else {
                  setNewsStart(0);
                }
                handleCloseModalPress();
                setLoading(true);
              }}>
              <Text
                style={{
                  color: appColors.white,
                  fontFamily: appFont.Lato_Bold,
                  fontSize: fontScalling(2),
                }}>
                Pas toe
              </Text>
            </TouchableOpacity>
          </View>
        </BottomSheetFooter>
      );
    },
    [news.filter],
  );

  return (
    <>
      <GestureHandlerRootView
        style={{flex: 1, backgroundColor: appColors.screenBg}}>
        <View style={{flex: 1, marginBottom: 20}}>
          <AppHeader
            title="Nieuws"
            filter
            onPressFilter={handlePresentModalPress}
          />
          {loading && !refreshControll ? (
            <NewsShim />
          ) : (
            <>
              {news && news?.data.length > 0 ? (
                <FlatList
                  showsVerticalScrollIndicator={false}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshControll}
                      onRefresh={onRefresh}
                    />
                  }
                  style={{flex: 1, paddingHorizontal: 20}}
                  data={news.data}
                  keyExtractor={item => {
                    return item.id;
                  }}
                  onEndReached={() => {
                    newsStart == news.start
                      ? news.page < news.count && paging()
                      : null;
                  }}
                  renderItem={({item, index}) => {
                    return (
                      <NewsCard
                        ind={index}
                        key={index}
                        item={item}
                        load={loading}
                        onPress={() => {
                          if (item.description && item.description.length > 0) {
                            navigation.navigate('NewsDetails', {
                              description: item.description,
                            });
                          }
                          dispatch(setNewsTitle(item.title));
                        }}
                      />
                    );
                  }}
                  ListFooterComponent={
                    news.page == news.count ? (
                      <View style={{marginBottom: 80}}></View>
                    ) : (
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          height: 40,
                          width: '100%',
                        }}>
                        <ActivityIndicator
                          size={'small'}
                          color={appColors.themeRed}
                        />
                      </View>
                    )
                  }
                />
              ) : (
                <ScrollView
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshControll}
                      onRefresh={onRefresh}
                    />
                  }
                  contentContainerStyle={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      color: appColors.themeBlue,
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: appFont.Lato_Bold,
                      textAlign: 'center',
                    }}>
                    Er is geen nieuws gevonden
                  </Text>
                </ScrollView>
              )}
              {news.page == news.count && !refreshControll ? null : (
                <View style={{marginBottom: 70}}></View>
              )}
            </>
          )}
        </View>
        <BottomSheetModalProvider>
          <BottomSheetModal
            index={0}
            ref={bottomSheetModalRef}
            style={{position: 'relative'}}
            snapPoints={snapPoints}
            handleIndicatorStyle={{
              borderRadius: 30,
              width: '30%',
              backgroundColor: appColors.textBlack,
            }}
            enableContentPanningGesture={false}
            backdropComponent={renderBackdrop}
            footerComponent={renderFooter}
            onChange={handleSheetChanges}>
            <View
              style={{
                flex: 1,
                paddingHorizontal: 20,
                marginTop: 13,
                marginBottom: 60,
              }}>
              <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  marginBottom: 25,
                }}>
                <Text
                  style={{
                    color: appColors.textBlack,
                    fontFamily: appFont.Lato_Bold,
                    fontSize: fontScalling(2.1),
                  }}>
                  Selecteer één of meerdere categorieën
                </Text>
                <TouchableOpacity onPress={clearFunction}>
                  <Text
                    style={{
                      color: appColors.textBlack,
                      fontFamily: appFont.Lato_Regular,
                      fontSize: fontScalling(2),
                    }}>
                    Reset
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flex: 1,
                  borderRadius: 3,
                  overflow: 'hidden',
                }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                    }}>
                    {news.filter &&
                      news.filter.map((value, index) => {
                        return (
                          <CustomCheckbox
                            key={index}
                            keyValue={index}
                            value={value}
                            onpress={() => {
                              selectFilter(
                                {
                                  id: value.id,
                                  category: value.category,
                                  checked: value.checked == 0 ? 1 : 0,
                                },
                                index,
                              );
                            }}
                          />
                        );
                      })}
                  </View>
                </ScrollView>
              </View>
            </View>
            <View style={{marginBottom: 80}}></View>
          </BottomSheetModal>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </>
  );
}

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
