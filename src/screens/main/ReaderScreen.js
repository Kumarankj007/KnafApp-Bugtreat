import React from 'react';
import {Dimensions, ScrollView, StyleSheet, View} from 'react-native';
import {appColors} from '../../utilities/appColors';
import {RedButton} from '../../components/Buttons/RedButton';
import Pdf from 'react-native-pdf';
import {ImageZoom} from '@likashefqet/react-native-image-zoom';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';

export default function ReaderScreen({navigation, route}) {
  const {data} = route.params;

  // share file:
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

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: appColors.white,
      }}>
      {/* {console.log(data.file, 'data.file')} */}
      {data.extension === 'pdf' ? (
        <View style={{flex: 1}}>
          <Pdf
            page={1}
            scale={1.0}
            enablePaging={true}
            spacing={0}
            trustAllCerts={false}
            source={{
              uri: data.file,
              cache: true,
            }}
            style={{
              flex: 1,
              width: Dimensions.get('window').width,
              backgroundColor: appColors.white,
              marginBottom: 75,
            }}
            onError={error => {
              console.log(error);
            }}
            minScale={1.0}
            maxScale={3.0}
            showsVerticalScrollIndicator={false}
          />
          <View
            style={{
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
              paddingVertical: 30,
              paddingHorizontal: 20,
              position: 'absolute',
              bottom: 60,
              right: 5,
            }}>
            <RedButton
              title={'Delen'}
              ricomp={'Entypo'}
              iconName={'share'}
              iconColor={appColors.white}
              iconSize={24}
              onPress={() => {
                shareFILE(data.extension, data.file);
              }}
            />
          </View>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{flex: 1}}>
          <View style={styles.image}>
            <ImageZoom
              uri={data.file}
              style={{width: '100%', height: '100%'}}
              minScale={0.5}
              maxScale={5}
              doubleTapScale={3}
              minPanPointers={1}
              isSingleTapEnabled
              isDoubleTapEnabled
            />
          </View>
          <View
            style={{
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
              paddingVertical: 30,
              paddingHorizontal: 20,
              position: 'absolute',
              bottom: 60,
              right: 5,
            }}>
            <RedButton
              title={'Delen'}
              ricomp={'Entypo'}
              iconName={'share'}
              iconColor={appColors.white}
              iconSize={24}
              onPress={() => {
                shareFILE(data.extension, data.file);
              }}
            />
          </View>
          <View style={{marginBottom: 70}} />
        </ScrollView>
      )}
    </View>
  );
}

const {width, height} = Dimensions.get('screen');

const styles = StyleSheet.create({
  image: {
    width: width,
    height: height / 1.62,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    paddingHorizontal: 20,
  },
});
