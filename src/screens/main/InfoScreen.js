import React from 'react';
import {Linking, Pressable, StyleSheet, Text, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {ThemeCard} from '../../components/Cards/ThemeCard';
import {appColors} from '../../utilities/appColors';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import {appFont} from '../../utilities/appFonts';
import {RedButton} from '../../components/Buttons/RedButton';
import {Icon} from '../../utilities/AppIcons';
import {fontScalling} from '../../utilities/HelpeFunction';
import {CommonActions} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import VersionCheck from 'react-native-version-check';

export default function InfoScreen({navigation}) {
  const {infoContent} = useSelector(state => state.settings);
  const infoMain =
    infoContent && Object.keys(infoContent).length > 0
      ? infoContent.info_contents[0]
      : [];
  return (
    <View style={{flex: 1}}>
      {infoContent && Object.keys(infoContent).length > 0 ? (
        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
          {infoMain && Object.keys(infoMain).length > 0 && (
            <ThemeCard
              children={
                <View>
                  <Text style={styles.header}>{infoMain.title}</Text>
                  <View style={{paddingVertical: 10}}>
                    {infoMain.content && infoMain.content == '' ? (
                      <Text style={styles.description}>{infoMain.content}</Text>
                    ) : (
                      <Text style={styles.description}>
                        Log direct in op jouw persoonlijke KNAF omgeving via je
                        eigen browser.
                      </Text>
                    )}
                  </View>
                  <View style={{paddingTop: 10, paddingRight: '50%'}}>
                    <RedButton
                      title={infoMain.button_text}
                      iconColor={appColors.white}
                      iconComp={'AntDesign'}
                      iconName={'doubleright'}
                      iconSize={18}
                      onPress={() => {
                        Linking.openURL(
                          'https://mycubus.bettywebblocks.com/knaf/login',
                        );
                      }}
                    />
                  </View>
                </View>
              }
            />
          )}
          {/* <ThemeCard
            children={
              <Pressable
                onPress={() => {
                  navigation.navigate('sos');
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={styles.smallheader}>SOS</Text>
                  <Icon
                    ComponentName={'AntDesign'}
                    name={'right'}
                    color={appColors.textBlack}
                    size={24}
                  />
                </View>
              </Pressable>
            }
          /> */}
          <ThemeCard
            children={
              <Pressable
                onPress={() => {
                  navigation.navigate('FAQ');
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={styles.smallheader}>FAQ</Text>
                  <Icon
                    ComponentName={'AntDesign'}
                    name={'right'}
                    color={appColors.textBlack}
                    size={24}
                  />
                </View>
              </Pressable>
            }
          />
          {/* <ThemeCard
            children={
              <Pressable
                onPress={() => {
                  navigation.navigate('Videos');
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={styles.smallheader}>Video's</Text>
                  <Icon
                    ComponentName={'AntDesign'}
                    name={'right'}
                    color={appColors.textBlack}
                    size={24}
                  />
                </View>
              </Pressable>
            }
          /> */}
          <ThemeCard
            children={
              <Pressable
                onPress={() => {
                  navigation.navigate('infoPdfList');
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={styles.smallheader}>Download's</Text>
                  <Icon
                    ComponentName={'AntDesign'}
                    name={'right'}
                    color={appColors.textBlack}
                    size={24}
                  />
                </View>
              </Pressable>
            }
          />
          <ThemeCard
            children={
              <Pressable
                onPress={() => {
                  navigation.navigate('news');
                  navigation.dispatch(
                    CommonActions.navigate({
                      name: 'News',
                    }),
                  );
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={styles.smallheader}>Nieuws</Text>
                  <Icon
                    ComponentName={'AntDesign'}
                    name={'right'}
                    color={appColors.textBlack}
                    size={24}
                  />
                </View>
              </Pressable>
            }
          />
          <ThemeCard
            children={
              <Pressable
                onPress={() => {
                  navigation.navigate('overons');
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={styles.smallheader}>Over ons</Text>
                  <Icon
                    ComponentName={'AntDesign'}
                    name={'right'}
                    color={appColors.textBlack}
                    size={24}
                  />
                </View>
              </Pressable>
            }
          />
          <ThemeCard
            children={
              <Pressable
                onPress={() => {
                  navigation.navigate('contact');
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={styles.smallheader}>Contact</Text>
                  <Icon
                    ComponentName={'AntDesign'}
                    name={'right'}
                    color={appColors.textBlack}
                    size={24}
                  />
                </View>
              </Pressable>
            }
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingVertical: 20,
              paddingBottom: 10,
              paddingHorizontal: 15,
            }}>
            {/* privacy policy */}
            <Pressable
              onPress={() => {
                navigation.navigate('PrivacyPolicy');
              }}>
              <Text style={styles.redText}>Privacybeleid</Text>
            </Pressable>
            {/* knaf.nl url */}
            <Pressable onPress={() => Linking.openURL('https://knaf.nl')}>
              <Text style={styles.description}>
                knaf.nl voor meer informatie
              </Text>
            </Pressable>
          </View>
          {/* version */}
          <View style={{paddingHorizontal: 15}}>
            <Text style={[styles.description, {marginLeft: 'auto'}]}>
              KNAF {VersionCheck.getCurrentVersion()}
            </Text>
          </View>
          <View style={{marginBottom: 70}} />
        </ScrollView>
      ) : (
        <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
          <Text
            style={{
              color: appColors.themeBlue,
              fontFamily: appFont.Lato_Bold,
              fontSize: fontScalling(2.1),
            }}>
            Data niet gevonden
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    color: appColors.textBlack,
    fontSize: fontScalling(2.5),
    fontFamily: appFont.Lato_Bold,
    lineHeight: fontScalling(3.0),
  },
  description: {
    color: appColors.grayBlack,
    fontFamily: appFont.Lato_Regular,
    fontSize: fontScalling(1.8),
    lineHeight: 18,
  },
  smallheader: {
    color: appColors.textBlack,
    fontSize: fontScalling(2),
    fontFamily: appFont.Lato_Bold,
  },
  redText: {
    color: appColors.themeRed,
    fontFamily: appFont.Lato_Regular,
    fontSize: fontScalling(1.8),
  },
});
