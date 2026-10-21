import React, {useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {ThemeCard} from '../../components/Cards/ThemeCard';
import {appColors} from '../../utilities/appColors';
import {RedButton} from '../../components/Buttons/RedButton';
import {Icon} from '../../utilities/AppIcons';
import {appFont} from '../../utilities/appFonts';
import {fontScalling} from '../../utilities/HelpeFunction';
import * as Animatable from 'react-native-animatable';
import ImagePicker from 'react-native-image-crop-picker';
import LottieView from 'lottie-react-native';
import Modal from 'react-native-modal';
import {useDispatch, useSelector} from 'react-redux';
import {setLicenseUpdate} from '../../redux/globalUseSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageView from 'react-native-image-viewing';

export default function UploadScreen() {
  const [ifUpload, setIfUpload] = useState(false);
  const [visibleImageView, setIsImageViewVisible] = useState({
    isVisible: false,
    index: null,
  });
  const [deleteModal, setdeleteModal] = useState({
    isVisible: false,
    index: null,
  });

  const dispatch = useDispatch();
  const {licenseUpdate} = useSelector(state => state.globalUse);

  const openGallery = async () => {
    await ImagePicker.openPicker({
      width: 576,
      height: 720,
      cropping: true,
    })
      .then(image => {
        if (image.path) {
          setIfUpload(false);
          AsyncStorage.setItem(
            'licenseUpload',
            JSON.stringify([...licenseUpdate, image.path]),
          );
          dispatch(setLicenseUpdate([...licenseUpdate, image.path]));
        }
      })
      .catch(error => {
        console.log('user cancel the upload', error);
      });
  };

  const openCamera = async () => {
    await ImagePicker.openCamera({
      useFrontCamera: false,
      width: 576,
      height: 720,
      cropping: true,
    })
      .then(image => {
        if (image.path) {
          setIfUpload(false);
          AsyncStorage.setItem(
            'licenseUpload',
            JSON.stringify([...licenseUpdate, image.path]),
          );
          dispatch(setLicenseUpdate([...licenseUpdate, image.path]));
        }
      })
      .catch(error => {
        console.log('user cancel the upload', error);
      });
  };

  const renderItem = ({item, index}) => {
    return (
      <View>
        <View
          style={[
            styles.conatiner,
            index == licenseUpdate.length - 1 && styles.noBorder,
          ]}>
          <Pressable
            onPress={() => {
              setIsImageViewVisible(prevDta => ({
                ...prevDta,
                index: index,
                isVisible: true,
              }));
            }}
            style={styles.image}>
            <Image
              source={{
                uri: item,
              }}
              resizeMode="cover"
              style={{width: '100%', height: '100%', borderWidth: 2.5}}
            />
          </Pressable>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Pressable
              onPress={() => {
                setIsImageViewVisible(prevDta => ({
                  ...prevDta,
                  index: index,
                  isVisible: true,
                }));
              }}
              style={styles.delete}>
              <Icon
                ComponentName={'Feather'}
                name={'eye'}
                color={appColors.themeBlue}
                size={20}
              />
            </Pressable>
            <Pressable
              onPress={() =>
                setdeleteModal(preData => {
                  return {
                    ...preData,
                    isVisible: !deleteModal.isVisible,
                    index: index,
                  };
                })
              }
              style={[styles.delete, {marginRight: 5, marginLeft: 10}]}>
              <Icon
                ComponentName={'FontAwesome'}
                name={'trash-o'}
                color={appColors.themeBlue}
                size={20}
              />
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{flex: 1, position: 'relative'}}>
      {licenseUpdate.length > 0 ? (
        <>
          <ThemeCard
            children={
              <View>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  keyExtractor={(item, index) => index}
                  renderItem={renderItem}
                  data={licenseUpdate}
                />
              </View>
            }
          />

          <View style={{marginBottom: 90}} />
        </>
      ) : (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
          }}>
          <LottieView
            resizeMode="contain"
            style={{
              width: width,
              height: width / 2,
              marginTop: '-50%',
            }}
            source={require('../../../assets/Images/lottieView/upload.json')}
            autoPlay
            loop={true}
          />
          <Text
            style={{
              fontFamily: appFont.Lato_Regular,
              color: appColors.textBlack,
              fontSize: fontScalling(2),
              textAlign: 'center',
              textAlignVertical: 'center',
            }}>
            Upload een afbeelding
          </Text>
        </View>
      )}
      <View
        style={{
          position: 'absolute',
          left: '5%',
          bottom: '26%',
          right: 0,
        }}>
        <View style={{position: 'absolute', top: 40, zIndex: 500}}>
          <Pressable
            onPress={() => setIfUpload(!ifUpload)}
            style={styles.upload}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
              <Icon
                ComponentName={'AntDesign'}
                name={'upload'}
                color={appColors.white}
                size={20}
              />
              <Text style={styles.uploadText}>Uploaden</Text>
            </View>
          </Pressable>
        </View>
        {ifUpload && (
          <>
            <Animatable.View
              onTouchEnd={() => openCamera()}
              animation={'fadeInUp'}
              duration={500}
              style={{position: 'absolute', top: '20%', left: '5%'}}>
              <Pressable style={styles.uploadSubButton}>
                <View
                  style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                  <Icon
                    ComponentName={'AntDesign'}
                    name={'camera'}
                    color={appColors.white}
                    size={15}
                  />
                </View>
              </Pressable>
            </Animatable.View>
            <Animatable.View
              onTouchEnd={() => openGallery()}
              animation={'fadeInUp'}
              duration={800}
              style={{position: 'absolute', top: '-30%', left: '20%'}}>
              <Pressable style={styles.uploadSubButton}>
                <View
                  style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                  <Icon
                    ComponentName={'FontAwesome'}
                    name={'photo'}
                    color={appColors.white}
                    size={15}
                  />
                </View>
              </Pressable>
            </Animatable.View>
          </>
        )}
      </View>
      <Modal
        deviceHeight={height}
        deviceWidth={width}
        // style={{margin:0}}
        focusable={true}
        hasBackdrop={true}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          height: height,
        }}
        onBackdropPress={() =>
          setdeleteModal(preData => {
            return {...preData, isVisible: false};
          })
        }
        transparent={true}
        isVisible={deleteModal.isVisible}
        backdropColor={appColors.overlayBg}
        backdropOpacity={1}
        onRequestClose={() => {
          setdeleteModal(preData => {
            return {...preData, isVisible: false};
          });
        }}>
        <View
          style={{
            backgroundColor: appColors.white,
            paddingHorizontal: 20,
            paddingTop: 40,
            paddingBottom: 30,
            alignItems: 'center',
            position: 'relative',
            borderRadius: 5,
            width: '100%',
            maxWidth: 400,
            elevation: 10,
          }}>
          <Pressable
            onPress={() =>
              setdeleteModal(preData => {
                return {...preData, isVisible: !deleteModal.isVisible};
              })
            }
            style={{
              position: 'absolute',
              top: '15%',
              right: '5%',

              // width:30,height:30
            }}>
            <Icon
              ComponentName={'Ionicons'}
              name={'close'}
              size={width > 500 ? 25 : 20}
              color={appColors.textBlack}
            />
          </Pressable>
          <Text
            style={{
              fontFamily: appFont.Lato_Bold,
              fontSize: fontScalling(width > 500 ? 2.5 : 2.2),
              color: appColors.textBlack,
              paddingBottom: 20,
              textAlign: 'center',
            }}>
            Weet je zeker dat je wilt verwijderen ?
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
            }}>
            <Pressable
              style={{
                backgroundColor: appColors.themeRed,
                paddingHorizontal: 15,
                paddingVertical: 9,
                borderRadius: 3,
                width: 130,
              }}
              onPress={async () => {
                const licenseUpdateState = [...licenseUpdate];
                licenseUpdateState.splice(deleteModal.index, 1);
                await AsyncStorage.setItem(
                  'licenseUpload',
                  JSON.stringify(licenseUpdateState),
                );
                dispatch(setLicenseUpdate(licenseUpdateState));
                setdeleteModal(preData => {
                  return {...preData, isVisible: false};
                });
              }}>
              <Text
                style={{
                  fontFamily: appFont.Lato_Bold,
                  fontSize: fontScalling(width > 500 ? 2.5 : 2),
                  color: appColors.white,
                  textAlign: 'center',
                  textTransform: 'capitalize',
                }}>
                Verwijderen
              </Text>
            </Pressable>
            <Pressable
              style={{
                backgroundColor: appColors.themeBlue,
                paddingHorizontal: 15,
                paddingVertical: 9,
                borderRadius: 3,
                width: 130,
                marginLeft: 10,
              }}
              onPress={() =>
                setdeleteModal(preData => {
                  return {...preData, isVisible: !deleteModal.isVisible};
                })
              }>
              <Text
                style={{
                  fontFamily: appFont.Lato_Bold,
                  fontSize: fontScalling(width > 500 ? 2.5 : 2),
                  color: appColors.white,
                  textAlign: 'center',
                  textTransform: 'capitalize',
                }}>
                Annuleren
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <ImageView
        images={licenseUpdate.map(data => ({uri: data}))}
        imageIndex={visibleImageView.index}
        visible={visibleImageView.isVisible}
        onRequestClose={() =>
          setIsImageViewVisible(preData => ({...preData, isVisible: false}))
        }
      />
    </View>
  );
}

const {width, height} = Dimensions.get('screen');

const styles = StyleSheet.create({
  conatiner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomColor: appColors.grayBlack,
    borderBottomWidth: 0.3,
  },
  image: {
    alignItems: 'center',
    justifyContent: 'center',
    width: width / 3.5,
    height: width / 5.5,
  },
  delete: {
    alignItems: 'center',
    justifyContent: 'center',
    width: width / 10,
    height: width / 10,
    borderRadius: width / 20,
    borderColor: appColors.themeBlue,
    padding: 5,
    borderWidth: 1,
  },
  upload: {
    backgroundColor: appColors.themeBlue,
    borderRadius: 25,
    paddingHorizontal: 25,
    paddingVertical: 10,
  },
  uploadSubButton: {
    backgroundColor: appColors.textBlack,
    borderRadius: 50,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  uploadText: {
    color: appColors.white,
    fontFamily: appFont.Lato_Bold,
    fontSize: fontScalling(1.8),
  },
  noBorder: {
    borderBottomWidth: 0,
  },
});
