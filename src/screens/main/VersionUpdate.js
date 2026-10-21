import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';
import {appColors} from '../../utilities/appColors';
import {appFont} from '../../utilities/appFonts';
import {fontScalling} from '../../utilities/HelpeFunction';

const {width, height} = Dimensions.get('screen');
const VersionUpdate = ({latestVersion, appUrl}) => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        paddingBottom: 50,
        justifyContent: 'center',
        backgroundColor: appColors.white,
      }}>
      <View
        style={{
          borderColor: appColors.themeRed,
          borderRadius: 15,
          paddingHorizontal: 10,
        }}>
        <LottieView
          style={{
            width: width,
            height: width / 1.5,
          }}
          loop={true}
          autoPlay={true}
          resizeMode="contain"
          source={require('../../../assets/Images/lottieView/update.json')}
        />
        <Text
          style={{
            textAlign: 'center',
            fontFamily: appFont.Lato_Bold,
            fontSize: fontScalling(1.8),
            color: appColors.textBlack,
            marginTop: 20,
          }}>
          Download de nieuwste versie van de KNAF App in de Playstore
        </Text>
        <TouchableOpacity
          onPress={async () => {
            const supported = await Linking.canOpenURL(appUrl);

            if (supported) {
              await Linking.openURL(appUrl);
            } else {
              Alert.alert(`Don't know how to open this URL: ${appUrl}`);
            }
          }}
          style={{
            backgroundColor: appColors.themeBlue,
            borderRadius: 10,
            padding: 10,
            width: '80%',
            marginTop: 20,
            alignSelf: 'center',
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontFamily: appFont.Lato_Bold,
              fontSize: fontScalling(1.8),
              color: appColors.textWhite,
            }}>
            Update Now
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default VersionUpdate;
