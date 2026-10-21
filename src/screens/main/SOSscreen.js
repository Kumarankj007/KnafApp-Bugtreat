import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Linking
} from 'react-native';
import React, {useRef, useState} from 'react';
import Video from 'react-native-video';
import {appColors} from '../../utilities/appColors';
import {appFont} from '../../utilities/appFonts';
import {fontScalling} from '../../utilities/HelpeFunction';
import {ThemeCard} from '../../components/Cards/ThemeCard';
import {Icon} from '../../utilities/AppIcons';
import YoutubePlayer from 'react-native-youtube-iframe';
import {useDispatch, useSelector} from 'react-redux';

const {width, height} = Dimensions.get('screen');

export default function SOSscreen() {
  const {infoContent} = useSelector(state => state.settings);

  const videoStatus = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showYouTubeButton, setShowYouTubeButton] = useState(false);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    setShowYouTubeButton(true);
  };
  const sosContent = infoContent.Content[0];
  const embedCode = sosContent.link;
  const videoId = embedCode.split('/').pop();
  return (
    <View style={{flex: 0.9}}>
     <View style={{paddingHorizontal: 20}}>
        {videoId && (
          <>
            <View
              style={{
                width: '100%',
                height: width / 2.2,
                backgroundColor: 'red'
              }}>
              <YoutubePlayer
                height={'100%'}
                play={isPlaying}
                videoId={videoId}
              />
            </View>
          </>
        )}
        <Text style={styles.text}>{sosContent.content}</Text>
      </View>

      {/* <FlatList
      keyExtractor={item => item.id}
      data ={infoContent.Content}
      style = {{flex: .5}}
      renderItem={({item}) => {
        
        return(
          <>
            
          </>
        );
      }}
    /> */}

      <FlatList
        style={{flex: 0.5}}
        keyExtractor={item => item.id}
        data={infoContent.SOS_links}
        renderItem={({item}) => {
          return (
            <>
              <ThemeCard
                children={
                  <Pressable
                    onPress={() => {Linking.openURL(item.site_url);}}
                  >
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                      }}>
                      <View style={{flex: 1}}>
                        <Text style={styles.boldtext}>{item.link_text}</Text>
                      </View>
                      <Icon
                        ComponentName={'AntDesign'}
                        name={'right'}
                        color={appColors.textBlack}
                        size={20}
                      />
                    </View>
                  </Pressable>
                }
              />
            </>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  vedioBack: {
    width: '100%',
    height: width / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    position: 'relative',
  },
  text: {
    color: appColors.textBlack,
    fontFamily: appFont.Lato_Regular,
    fontSize: fontScalling(1.8),
    lineHeight: 25,
    paddingVertical: 15,
  },
  boldtext: {
    color: appColors.textBlack,
    fontFamily: appFont.Lato_Bold,
    fontSize: fontScalling(1.8),
  },
  youtubeButton: {
    position: 'absolute',
    width: width / 5,
    height: width / 5.5,
    alignItems: 'center',
    justifyContent: 'center',
    left: width / 2.8,
    right: 0,
    bottom: 0,
    top: width / 6.5,
  },
});
