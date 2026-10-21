import React, {useEffect, useState, useCallback} from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {useSelector} from 'react-redux';
import {url} from '../../utilities/appApi';
import {appColors} from '../../utilities/appColors';
import {Icon} from '../../utilities/AppIcons';
import {appFont} from '../../utilities/appFonts';
import {fontScalling} from '../../utilities/HelpeFunction';
import {RedButton} from '../../components/Buttons/RedButton';
import {files} from '../../utilities/dummyData';
import {useNavigation} from '@react-navigation/native';
import HtmlView from '../../components/html/HtmlView';
import {ThemeCard} from '../../components/Cards/ThemeCard';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import {useDispatch} from 'react-redux';
import {setReaderTitle} from '../../redux/TitleSlice';

export default function ClassTab({route}) {
  const {files, subtab_content, eventId, classId, subtab_id} = route.params;
  const dispatch = useDispatch();
  // console.log(JSON.stringify(route, undefined, 2), 'route');
  const [subtabs, setSubtabs] = useState({
    files: files,
    subtab_content: subtab_content,
  });
  const [refresh, setRefresh] = useState(false);

  const navigation = useNavigation();
  const {userAgent} = useSelector(state => state.settings);

  const shareFILE = async (ext, url) => {
    const name = url.split('/').slice(-1).toString().split('.')[0];
    try {
      const filePath = RNFS.DocumentDirectoryPath + `/${name}.${ext}`;
      const response = await fetch(url);
      const blob = await response.blob();
      const fileReaderInstance = new FileReader();
      fileReaderInstance.readAsDataURL(blob);
      fileReaderInstance.onloadend = async () => {
        const base64data = fileReaderInstance.result;
        await RNFS.writeFile(filePath, base64data.split(',')[1], 'base64');
        const options = {
          title: 'Share PDF',
          url: 'file://' + filePath,
          type: ext == 'pdf' ? 'application/pdf' : 'image/jpeg',
        };
        await Share.open(options);
      };
    } catch (error) {
      console.log('Error =>', error);
    }
  };

  const eventClasses = () => {
    if (userAgent && userAgent != '') {
      (async () => {
        try {
          const headers = new Headers();
          const formData = new FormData();

          headers.append('User-Agent', userAgent);
          formData.append('event_id', eventId);
          const response = await fetch(url().eventClasses, {
            method: 'POST',
            body: formData,
            headers: headers,
          });
          // console.log(response, 'formData');
          if (response.status == 200) {
            const resparse = await response.json();
            if (resparse.data) {
              const classs = resparse.data.filter(data => {
                return data.class_id == classId && data;
              });
              const tab = classs[0].subtabs.filter(data => {
                return data.subtab_id == subtab_id && data;
              });
              // console.log(JSON.stringify(tab[0], undefined, 2), 'datas');
              setSubtabs({
                files: tab[0].files,
                subtab_content: tab[0].subtab_content,
              });
              setRefresh(false);
            }
          } else {
            setRefresh(false);
            console.log('class tabs status code :', resparse.status);
          }
        } catch {
          setRefresh(false);
          console.log('error occured');
        }
      })();
    }
  };

  const onRefresh = useCallback(() => {
    setRefresh(true);
  }, []);

  useEffect(() => {
    if (refresh) {
      eventClasses();
    }
  }, [refresh]);

  return (
    <>
      <View style={{flex: 1}}>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          refreshControl={
            <RefreshControl onRefresh={onRefresh} refreshing={refresh} />
          }>
          {subtabs.subtab_content != '' && subtabs.subtab_content != null && (
            <View>
              <ThemeCard
                altStyle={{
                  paddingVertical: 0,
                  elevation: 0,
                  backgroundColor: 'transparent',
                }}
                children={<HtmlView url={subtabs.subtab_content} />}
              />
            </View>
          )}
          {subtabs.files && subtabs.files.length > 0 && (
            <FlatList
              style={{paddingHorizontal: 15}}
              data={subtabs.files}
              scrollEnabled={false}
              keyExtractor={(data, index) => index}
              showsVerticalScrollIndicator={false}
              renderItem={({item}) => {
                return (
                  <>
                    <View style={styles.container}>
                      <Pressable
                        onPress={() => {
                          navigation.navigate('reader', {
                            data: item,
                            from: 'classtab',
                          });
                          dispatch(setReaderTitle(item.title));
                        }}
                        style={{
                          alignItems: 'flex-start',
                          justifyContent: 'center',
                        }}>
                        {item.extension == 'pdf' ? (
                          <View style={styles.document}>
                            <Icon
                              ComponentName={'Fontisto'}
                              name={'acrobat-reader'}
                              color={appColors.white}
                              size={18}
                            />
                          </View>
                        ) : (
                          <View>
                            <Icon
                              ComponentName={'FontAwesome'}
                              name={'image'}
                              color={appColors.themeBlue}
                              size={width > 500 ? 40 : 25}
                            />
                          </View>
                        )}
                      </Pressable>
                      <Pressable
                        onPress={() => {
                          navigation.navigate('reader', {
                            data: item,
                            from: 'classtab',
                          });
                          dispatch(setReaderTitle(item.title));
                        }}
                        style={{flex: 1, paddingLeft: 10}}>
                        <Text style={styles.title}>{item.title}</Text>
                      </Pressable>
                      <View style={{paddingHorizontal: 10}}>
                        <RedButton
                          title={'Openen'}
                          iconColor={appColors.white}
                          iconComp={'AntDesign'}
                          iconName={'doubleright'}
                          iconSize={18}
                          onPress={() => {
                            navigation.navigate('reader', {
                              data: item,
                              from: 'classtab',
                            });
                          dispatch(setReaderTitle(item.title));
                          }}
                        />
                      </View>
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Pressable
                          onPress={() => shareFILE(item.extension, item.file)}>
                          <Icon
                            ComponentName={'Entypo'}
                            name={'share'}
                            color={appColors.themeBlue}
                            size={25}
                          />
                        </Pressable>
                      </View>
                    </View>
                  </>
                );
              }}
            />
          )}
        </ScrollView>
        {subtabs.files && subtabs.files.length < 1 && (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: appColors.themeBlue,
                fontFamily: appFont.Lato_Bold,
                fontSize: fontScalling(1.8),
                lineHeight: fontScalling(1.8),
              }}>
              Geen inhoud gevonden
            </Text>
          </View>
        )}
        <View style={{marginBottom: 70}}></View>
      </View>
    </>
  );
}

const {width, height} = Dimensions.get('screen');

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  document: {
    backgroundColor: appColors.themeRed,
    borderRadius: 5,
    width: width > 500 ? width / 17 : width / 13,
    height: width > 500 ? width / 17 : width / 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: appColors.textBlack,
    fontFamily: appFont.Lato_Bold,
    fontSize: fontScalling(1.8),
  },
});
