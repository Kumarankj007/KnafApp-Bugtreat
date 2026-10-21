import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {appColors} from '../../utilities/appColors';
import {appFont} from '../../utilities/appFonts';
import {useDispatch, useSelector} from 'react-redux';
import {setData} from '../../redux/videoSlice';

const {width, height} = Dimensions.get('screen');

export default function VideosScreen({navigation}) {
  const dispatch = useDispatch();

  const {infoContent} = useSelector(state => state.settings);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: appColors.screenBg,
      }}>
      <FlatList
        data={infoContent.videos}
        keyExtractor={item => item.id}
        numColumns={2}
        style={{
          flexWrap: 'wrap',
          flexDirection: 'row',
        }}
        contentContainerStyle={{
          alignItems: 'center',
          flex: 1,
        }}
        renderItem={({item, index}) => {
          return (
            <View
              style={{
                paddingRight: index % 2 == 0 ? 10 : 0,
                paddingTop: 10,
              }}>
              <Pressable
                onPress={() => {
                  navigation.navigate('videoDetail', {
                    videoData: {item},
                  });
                  dispatch(setData(item));
                }}
                style={{
                  borderRadius: 15,
                  height: width / 2,
                  width: width / 2 - 30,
                  alignItems: 'center',
                  backgroundColor: appColors.white,
                }}>
                <View style={styles.container}>
                  <View style={[styles.img]}>
                    {item.image && (
                      <Image
                        source={{uri: item.image}}
                        resizeMode="cover"
                        style={{
                          width: '100%',
                          height: '100%',
                          alignSelf: 'center',
                        }}
                      />
                    )}
                  </View>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 10,
                      height: height / 13,
                    }}>
                    <Text numberOfLines={2} style={styles.text}>
                      {item.title}
                    </Text>
                  </View>
                </View>
              </Pressable>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
  },
  img: {
    backgroundColor: appColors.grayBlack,
    width: width / 2 - 30,
    height: width / 2,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    overflow: 'hidden',
    resizeMode: 'cover',
  },
  text: {
    color: appColors.textBlack,
    fontFamily: appFont.Lato_Bold,
    textAlign: 'center',
  },
});
