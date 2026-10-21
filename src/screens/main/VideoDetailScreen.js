import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import YoutubePlayer from 'react-native-youtube-iframe';
import {appColors} from '../../utilities/appColors';
import {appFont} from '../../utilities/appFonts';
import {fontScalling} from '../../utilities/HelpeFunction';
import RenderHTML from 'react-native-render-html';

export default function VideoDetailScreen({route}) {
  const {data} = useSelector(state => state.video);

  const {videoData} = route.params;

  const embedCode = videoData.item.embed_code;
  const videoId = embedCode.split('/').pop();

  const [isPlaying, setIsPlaying] = useState(false);
  const [showYouTubeButton, setShowYouTubeButton] = useState(false);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    setShowYouTubeButton(true);
  };

  const {width} = useWindowDimensions();
  const description = {html: `${videoData.item.description}`};

  return (
    <View style={{flex: 1, paddingHorizontal: 20}}>
      {videoId && videoId != '' && (
        <>
          <View
            style={{
              width: '100%',
              height: (width - 40) / 1.8,
            }}>
            <YoutubePlayer height={'100%'} play={isPlaying} videoId={videoId} />
          </View>
        </>
      )}

      <View style={{paddingVertical: 35}}>
        <View style={{paddingVertical: 5}}>
          <Text style={styles.lightText}>{videoData.item.added_date}</Text>
        </View>
        <Text style={styles.title}>{videoData.item.title}</Text>
        <View style={{paddingVertical: 5}}>
          <RenderHTML
            width={width}
            source={description}
            tagsStyles={{
              body: {
                color: appColors.textBlack,
                fontFamily: appFont.Lato_Regular,
                fontSize: fontScalling(1.8),
              },
            }}
          />
        </View>
      </View>
    </View>
  );
}
const {width, height} = Dimensions.get('screen');
const styles = StyleSheet.create({
  title: {
    color: appColors.themeBlue,
    fontFamily: appFont.Lato_Bold,
    fontSize: fontScalling(3),
  },
  lightText: {
    color: appColors.textBlack,
    fontFamily: appFont.Lato_Regular,
    fontSize: fontScalling(1.8),
  },
});
