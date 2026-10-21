import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ThemeCard } from '../../components/Cards/ThemeCard'
import { appColors } from '../../utilities/appColors'
import { appFont } from '../../utilities/appFonts'
import { fontScalling } from '../../utilities/HelpeFunction'
import { Icon } from '../../utilities/AppIcons'
import { useSelector } from 'react-redux'
import {WebView} from 'react-native-webview'

export default function ContactScreen() {

  const {infoContent} = useSelector(state => state.settings);
  const contactInfo = infoContent.contact_info;
  const partnerLogos = infoContent.partner_logos;

    return (
      <View style={{flex: 1}}>
        <View
          style={{
            paddingBottom: 10,
            flexDirection: 'row',
            justifyContent: 'center',
            paddingHorizontal: 15,
          }}>
          {partnerLogos.map((item, index) => {
            return (
              <View
                key={index}
                style={{
                  padding: 3,
                  backgroundColor: appColors.white,
                  width: width / 5.8,
                  height: width / 5.8,
                  marginHorizontal: width / 150,
                  borderRadius: 7,
                  overflow: 'hidden',
                }}>
                <Image
                  source={{uri: item}}
                  style={{width: '100%', height: '100%', resizeMode: 'cover'}}
                />
              </View>
            );
          })}
        </View>
        <View style={{paddingBottom: 10}}>
          <ThemeCard
            children={
              <View>
                <Text style={styles.header}>KNAF Federatiebureau</Text>
                <View style={{marginTop: 20}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingBottom: 10,
                    }}>
                    <Icon
                      ComponentName={'SimpleLineIcons'}
                      name={'location-pin'}
                      size={20}
                      color={appColors.grayBlack}
                    />
                    <View style={{flex: 1, paddingLeft: 10}}>
                      <Text style={styles.text}>{contactInfo[2].Address}</Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingBottom: 10,
                    }}>
                    <Icon
                      ComponentName={'OctIcons'}
                      name={'mail'}
                      size={20}
                      color={appColors.grayBlack}
                    />
                    <View style={{flex: 1, paddingLeft: 10}}>
                      <Text style={styles.text}>
                        {contactInfo[1]['E-mail']}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingBottom: 10,
                    }}>
                    <Icon
                      ComponentName={'SimpleLineIcons'}
                      name={'phone'}
                      size={20}
                      color={appColors.grayBlack}
                    />
                    <View style={{flex: 1, paddingLeft: 10}}>
                      <Text style={styles.text}>{contactInfo[0].Mobile}</Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingBottom: 10,
                    }}>
                    <Icon
                      ComponentName={'SimpleLineIcons'}
                      name={'clock'}
                      size={20}
                      color={appColors.grayBlack}
                    />
                    <View style={{flex: 1, paddingLeft: 10}}>
                      <Text style={styles.text}>{contactInfo[3].content}</Text>
                    </View>
                  </View>
                </View>
              </View>
            }
          />
        </View>
        <View style={styles.img}>
          {/* <MapView
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: 52.02298540503814,
            longitude: 5.145925654247054,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          style={{
            width: '100%',
            height: '100%',
            flex: 1,
          }}

          // showsUserLocation={true} // Show user's location on the map
        >
          <Marker
            style={{width: 100, height: 100}}
            coordinate={{
              latitude: 52.02298540503814,
              longitude: 5.145925654247054,
            }}
            image={require('../../../assets/Images/mapMarker.png')}
          />
      </MapView> */}
          <WebView
            originWhitelist={['*']}
            source={{ html: `<html>
            <body>
            <iframe src="${contactInfo[4].Gapi}" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
            </body>
          </html>` }}
            style={{width:width}}
          />
          <View style={{marginBottom: 65}}></View>
        </View>
      </View>
    );
}

const {width,height} = Dimensions.get('screen');

const styles = StyleSheet.create({
    header:{
        color:appColors.textBlack,
        fontFamily:appFont.Lato_Bold,
        fontSize:fontScalling(2.5),
    },
    text:{
        color:appColors.grayBlack,
        fontFamily:appFont.Lato_Bold,
        fontSize:fontScalling(1.8)
    },
    img:{
        width:width,
        height:height/1.8,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:10,
        flex:1
    }
})