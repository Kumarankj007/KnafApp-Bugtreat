import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {appColors} from '../../utilities/appColors';
import {Icon} from '../../utilities/AppIcons';
import {appFont} from '../../utilities/appFonts';
import {fontScalling, print} from '../../utilities/HelpeFunction';
import {useDispatch, useSelector} from 'react-redux';
import {setReaderTitle} from '../../redux/TitleSlice';
import ReactNativeBlobUtil from 'react-native-blob-util';
import {useToast} from 'react-native-toast-notifications';
import {url} from '../../utilities/appApi';

const InfoPdfList = ({navigation}) => {
  const [data, setData] = useState([]);

  const {fcmToken, userAgent} = useSelector(state => state.settings);
  const toast = useToast();
  const dispatch = useDispatch();
  const [load, setLoad] = useState(false);

  // /pdf apiCall:
  const apiCall = async () => {
    if (fcmToken && userAgent && fcmToken != '' && userAgent != '') {
      try {
        if (Object.keys(data).length == 0) {
          setLoad(true);
        }
        const headers = new Headers();
        const formData = new FormData();

        headers.append('User-Agent', userAgent);

        formData.append('deviceid', fcmToken);

        const response = await fetch(url().downloadPdf, {
          method: 'POST',
          body: formData,
          headers: headers,
        });
        print(formData, 'formData');
        if (response.status == 200) {
          const resparse = await response.json();
          if (resparse && resparse.status == 'success') {
            if (resparse?.data?.downloads_pdfs) {
              setData(resparse?.data?.downloads_pdfs);
            }
            setLoad(false);
          }
        } else {
          console.log('status code :', response.status);
          setLoad(false);
        }
      } catch (error) {
        console.log('error occured in pdf api');
        setLoad(false);
      }
    }
  };

  useEffect(() => {
    (() => {
      apiCall();
    })();
  }, []);

  // file download
  const downloadFile = list => {
    if (list && list?.data?.pdf) {
      const fileName = `${list?.data?.title} .pdf`;
      let dirs = ReactNativeBlobUtil.fs.dirs;
      ReactNativeBlobUtil.config({
        fileCache: true,
        appendExt: 'pdf',
        path: `${dirs.DocumentDir}/${fileName}`,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          title: fileName,
          description: 'File downloaded by download manager.',
          mime: 'application/pdf',
        },
      })
        .fetch('GET', url().basePdf + list?.data?.pdf)
        .then(res => {
          toast.hideAll();
          toast.show('Download Successfully', {
            type: 'success',
            duration: 3000,
            offset: 30,
            placement: 'bottom',
            animationType: 'zoom-in',
            style: {
              marginBottom: 60,
            },
          });
          // Vibration.vibrate(60);
        })
        .catch(err => console.log('BLOB ERROR -> ', err));
    }
  };

  const PdfList = data => {
    return (
      <Pressable
        onPress={() => {
          dispatch(setReaderTitle(data.data.title));
          navigation.navigate('reader', {
            data: {
              id: data?.data?.id,
              title: data?.data?.title,
              file: url().basePdf + data?.data?.pdf,
              extension: 'pdf',
            },
          });
        }}
        style={styles.card}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            // justifyContent: 'space-between',
            flexDirection: 'row',
          }}>
          <Icon
            color={appColors.themeRed}
            size={22}
            ComponentName={'AntDesign'}
            name={'pdffile1'}
          />
          <Text numberOfLines={2} style={styles.cardText}>
            {data.data.title}
          </Text>
        </View>
        <Pressable
          style={{padding: 5}}
          onPress={() => {
            downloadFile(data);
          }}>
          <Icon
            color={appColors.themeRed}
            size={25}
            ComponentName={'MaterialIcons'}
            name={'download'}
          />
        </Pressable>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      {load ? (
        <View
          style={[
            styles.container,
            {alignItems: 'center', justifyContent: 'center'},
          ]}>
          <ActivityIndicator color={appColors.switchBg} size={'large'} />
        </View>
      ) : (
        <>
          {data && data.length > 0 ? (
            <FlatList
              data={data}
              keyExtractor={data => data.id}
              renderItem={({item, index}) => {
                return item.deleted == '0' ? <PdfList data={item} /> : null;
              }}
              ItemSeparatorComponent={() => {
                return <View style={{paddingBottom: 15}} />;
              }}
            />
          ) : (
            <View
              style={[
                styles.container,
                {alignItems: 'center', justifyContent: 'center'},
              ]}>
              {/* <ActivityIndicator color={appColors.switchBg} size={'large'} /> */}
              <Text style={styles.cardText}>Data not found</Text>
            </View>
          )}
        </>
      )}
    </View>
  );
};

export default InfoPdfList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  card: {
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: appColors.shadowred,
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    elevation: 18,
    shadowColor: appColors.switchBg,
    backgroundColor: appColors.white,
  },
  cardText: {
    fontFamily: appFont.Lato_Bold,
    fontSize: fontScalling(2),
    color: appColors.textBlack,
    paddingLeft: 10,
  },
});
