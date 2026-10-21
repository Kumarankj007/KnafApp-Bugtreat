import React, {useEffect, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {EventStack, InfoStack, NewsStack, UploadStack} from './Stack';
import {StyleSheet} from 'react-native';
import {appColors} from '../utilities/appColors';
import {Icon} from '../utilities/AppIcons';
import {appFont} from '../utilities/appFonts';
import {
  responsiveFontSize,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import {fontScalling} from '../utilities/HelpeFunction';
import SystemNavigationBar from 'react-native-system-navigation-bar';

const Tab = createBottomTabNavigator();

export default function BottomTab() {
  const [tabName, setTabName] = useState('');

  useEffect(() => {
    SystemNavigationBar.navigationShow();
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="events"
      sceneContainerStyle={styles.container}
      screenListeners={({navigation, route}) => ({
        focus: e => {
          return e.target.includes('events')
            ? setTabName(1)
            : e.target.includes('news')
            ? setTabName(2)
            : e.target.includes('info')
            ? setTabName(3)
            : e.target.includes('upload')
            ? setTabName(4)
            : null;
        },
      })}
      screenOptions={{
        headerShown: false,
        tabBarLabel: true,
        tabBarActiveBackgroundColor: appColors.white,
        tabBarInactiveBackgroundColor: appColors.white,
        tabBarActiveTintColor: appColors.themeRed,
        tabBarInactiveTintColor: appColors.textBlack,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          height: 70,
          borderTopRightRadius: 25,
          borderTopLeftRadius: 25,
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          bottom: 0,
          // backgroundColor:'white'
        },
        tabBarIconStyle: {
          marginBottom: -10,
        },
      }}>
      <Tab.Screen
        name="events"
        component={EventStack}
        options={{
          tabBarActiveTintColor: appColors.themeRed,
          tabBarInactiveTintColor: appColors.textBlack,
          tabBarLabel: 'Evenementen',
          tabBarLabelStyle: {
            color: tabName == 1 ? appColors.themeRed : appColors.textBlack,
            fontSize: fontScalling(1.5),
            fontFamily: appFont.Lato_Regular,
            paddingBottom: 10,
          },
          tabBarIcon: ({focused}) => (
            <Icon
              name={'flag-checkered'}
              ComponentName={'MaterialCommunityIcons'}
              color={focused ? appColors.themeRed : appColors.textBlack}
              size={25}
            />
          ),
        }}
      />
      <Tab.Screen
        name="news"
        component={NewsStack}
        options={{
          tabBarActiveTintColor: appColors.themeRed,
          tabBarInactiveTintColor: appColors.textBlack,
          tabBarLabel: 'Nieuws',
          tabBarLabelStyle: {
            color: tabName == 2 ? appColors.themeRed : appColors.textBlack,
            fontSize: fontScalling(1.5),
            fontFamily: appFont.Lato_Regular,
            paddingBottom: 10,
          },
          tabBarIcon: ({focused}) => (
            <Icon
              name={'newspaper-outline'}
              ComponentName={'Ionicons'}
              color={focused ? appColors.themeRed : appColors.textBlack}
              size={25}
            />
          ),
        }}
      />
      <Tab.Screen
        name="info"
        component={InfoStack}
        options={{
          tabBarActiveTintColor: appColors.themeRed,
          tabBarInactiveTintColor: appColors.textBlack,
          tabBarLabel: 'Informatie',
          tabBarLabelStyle: {
            color: tabName == 3 ? appColors.themeRed : appColors.textBlack,
            fontSize: fontScalling(1.5),
            fontFamily: appFont.Lato_Regular,
            paddingBottom: 10,
          },
          tabBarIcon: ({focused}) => (
            <Icon
              name={'info'}
              ComponentName={'SimpleLineIcons'}
              color={focused ? appColors.themeRed : appColors.textBlack}
              size={25}
            />
          ),
        }}
      />
      <Tab.Screen
        name="upload"
        component={UploadStack}
        options={{
          tabBarActiveTintColor: appColors.themeRed,
          tabBarInactiveTintColor: appColors.textBlack,
          tabBarLabel: 'Upload',
          tabBarLabelStyle: {
            color: tabName == 4 ? appColors.themeRed : appColors.textBlack,
            fontSize: fontScalling(1.5),
            fontFamily: appFont.Lato_Regular,
            paddingBottom: 10,
          },
          tabBarIcon: ({focused}) => (
            <Icon
              name={'upload'}
              ComponentName={'Feather'}
              color={focused ? appColors.themeRed : appColors.textBlack}
              size={25}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
});
