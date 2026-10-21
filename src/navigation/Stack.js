import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import EventScreen from '../screens/main/EventsScreen';
import NewsScreen from '../screens/main/NewsScreen';
import InfoScreen from '../screens/main/InfoScreen';
import UploadScreen from '../screens/main/UploadScreen';
import {appColors} from '../utilities/appColors';
import {AppHeader} from '../components/AppHeader/AppHeader';
import PrivacyPolicy from '../screens/main/PrivacyPolicy';
import Noftification from '../screens/main/Notification';
import EventDetails from '../screens/main/EventDetails';
import ClassDetails from '../screens/main/ClassDetails';
import {useSelector} from 'react-redux';
import ClassTab from '../screens/main/ClassTab';
import ReaderScreen from '../screens/main/ReaderScreen';
import IntroSlider from '../screens/auth/IntroSlider';
import VideosScreen from '../screens/main/VideosScreen';
import FAQScreen from '../screens/main/FAQScreen';
import FAQdetailScreen from '../screens/main/FAQdetailScreen';
import OverOnsScreen from '../screens/main/OverOnsScreen';
import SOSscreen from '../screens/main/SOSscreen';
import NewsDetailScreen from '../screens/main/NewsDetailScreen';
import ContactScreen from '../screens/main/ContactScreen';
import VideoDetailScreen from '../screens/main/VideoDetailScreen';
import CategoriesScreen from '../screens/main/CategoriesScreen';
import {useDispatch} from 'react-redux';
import {setNotifeeDeleteModal} from '../redux/globalUseSlice';
import InfoPdfList from '../screens/main/InfoPdfList';
const Stack = createStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: false,
        contentStyle: {
          backgroundColor: appColors.themeBlue,
        },
        headerStatusBarHeight: 100,
      }}>
      <Stack.Group
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="introSlider" component={IntroSlider} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

// function ImageViewerStack() {
//   return (
//     <Stack.Navigator
//       screenOptions={{
//         headerShown: false,
//         contentStyle: {
//           backgroundColor: appColors.screenBg,
//         },
//       }}>
//       <Stack.Group
//         screenOptions={{
//           headerShown: true,
//           header: ({options, navigation}) => {
//             return (
//               <AppHeader
//                 option={options}
//                 redBack={true}
//                 onPressBack={() => navigation.goBack()}
//               />
//             );
//           },
//         }}>
//         <Stack.Screen
//           options={{title: 'Naam Van de afbeelding'}}
//           name="reader"
//           component={ReaderScreen}
//         />
//       </Stack.Group>
//     </Stack.Navigator>
//   );
// }

function EventStack() {
  const {title, tabtitle, readerTitle} = useSelector(state => state.title);
  // const {} = useSelector(state => state.title);
  const dispatch = useDispatch();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: appColors.screenBg,
        },
      }}>
      <Stack.Group
        screenOptions={{
          headerShown: true,
          header: ({options, navigation}) => {
            return (
              <AppHeader
                option={options}
                rightOptions
                onPressNotify={() => {
                  navigation.navigate('notification');
                }}
                onpressSetting={() => {
                  navigation.navigate('categories');
                }}
              />
            );
          },
        }}>
        <Stack.Screen
          options={{title: 'Evenementen'}}
          name="Events"
          component={EventScreen}
        />
      </Stack.Group>

      <Stack.Group
        screenOptions={{
          headerShown: false,
          header: ({options, navigation}) => {
            return (
              <AppHeader
                option={options}
                rightOptions
                onPressBack={() => {
                  navigation.goBack();
                }}
                onPressNotify={() => {
                  navigation.navigate('notification');
                }}
                onpressSetting={() => {
                  navigation.navigate('categories');
                }}
              />
            );
          },
        }}>
        <Stack.Screen
          options={{title: 'Evenementen'}}
          name="eventDetails"
          component={EventDetails}
        />
      </Stack.Group>

      <Stack.Group
        screenOptions={{
          headerShown: true,
          header: ({options, navigation}) => {
            return (
              <AppHeader
                option={options}
                rightOptions
                onPressBack={() => {
                  navigation.goBack();
                }}
                onPressNotify={() => {
                  navigation.navigate('notification');
                }}
                onpressSetting={() => {
                  navigation.navigate('categories');
                }}
              />
            );
          },
        }}>
        <Stack.Screen
          options={{title: title}}
          name="classDetails"
          component={ClassDetails}
        />
        <Stack.Screen
          options={{title: tabtitle}}
          name="classTab"
          component={ClassTab}
        />
      </Stack.Group>

      <Stack.Group
        screenOptions={{
          headerShown: true,
          statusBarStyle: 'light',
          statusBarColor: appColors.themeRed,
          header: ({options, navigation}) => {
            return (
              <AppHeader
                option={options}
                redBack={true}
                onPressBack={() => navigation.goBack()}
              />
            );
          },
        }}>
        <Stack.Screen
          options={{title: readerTitle}}
          name="reader"
          component={ReaderScreen}
        />
      </Stack.Group>

      <Stack.Group
        screenOptions={{
          headerShown: true,
          header: ({options, navigation}) => {
            return (
              <AppHeader
                option={options}
                bin
                onPressDelete={() => dispatch(setNotifeeDeleteModal(true))}
                onPressBack={() => {
                  navigation.goBack();
                }}
              />
            );
          },
        }}>
        <Stack.Screen
          options={{title: 'Notificaties'}}
          name="notification"
          component={Noftification}
        />
      </Stack.Group>

      <Stack.Group
        screenOptions={{
          headerShown: true,
          header: ({options, navigation}) => {
            return (
              <AppHeader
                option={options}
                onPressBack={() => {
                  navigation.goBack();
                }}
              />
            );
          },
        }}>
        <Stack.Screen
          options={{title: 'KNAF secties'}}
          name="categories"
          component={CategoriesScreen}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}

function NewsStack() {
  const {newsTitle} = useSelector(state => state.title);
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: appColors.screenBg,
        },
      }}>
      <Stack.Group
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen
          options={{title: 'Nieuws'}}
          name="News"
          component={NewsScreen}
        />
      </Stack.Group>
      <Stack.Group
        screenOptions={{
          headerShown: true,
          header: ({options, navigation}) => {
            return (
              <AppHeader
                option={options}
                onPressBack={() => {
                  navigation.goBack();
                }}
              />
            );
          },
        }}>
        <Stack.Screen
          options={{title: newsTitle}}
          name="NewsDetails"
          component={NewsDetailScreen}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}

function InfoStack() {
  const {faqTitle, readerTitle} = useSelector(state => state.title);
  const {data} = useSelector(state => state.video);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: appColors.screenBg,
        },
      }}>
      <Stack.Group
        screenOptions={{
          headerShown: true,
          header: ({options, navigation}) => {
            return (
              <AppHeader
                option={options}
                rightOptions
                onPressNotify={() => {
                  navigation.navigate('notification');
                }}
                onpressSetting={() => {
                  navigation.navigate('categories');
                }}
              />
            );
          },
        }}>
        <Stack.Screen
          options={{title: 'Informatie'}}
          name="Info"
          component={InfoScreen}
        />
      </Stack.Group>
      <Stack.Group
        screenOptions={{
          headerShown: true,
          header: ({options, navigation}) => {
            return (
              <AppHeader
                option={options}
                onPressBack={() => {
                  navigation.goBack();
                }}
              />
            );
          },
        }}>
        <Stack.Screen
          options={{title: 'Privacybeleid'}}
          name="PrivacyPolicy"
          component={PrivacyPolicy}
        />
        <Stack.Screen
          options={{title: 'Videos'}}
          name="Videos"
          component={VideosScreen}
        />
        <Stack.Screen
          options={{title: 'Downloads'}}
          name="infoPdfList"
          component={InfoPdfList}
        />
        <Stack.Screen
          options={{title: readerTitle}}
          name="reader"
          component={ReaderScreen}
        />
        <Stack.Screen
          options={{title: 'FAQ'}}
          name="FAQ"
          component={FAQScreen}
        />
        <Stack.Screen
          options={{title: faqTitle}}
          name="FAQdetails"
          component={FAQdetailScreen}
        />
        <Stack.Screen
          options={{title: 'Over ons'}}
          name="overons"
          component={OverOnsScreen}
        />
        <Stack.Screen
          options={{title: 'SOS'}}
          name="sos"
          component={SOSscreen}
        />
        <Stack.Screen
          options={{title: 'Contact'}}
          name="contact"
          component={ContactScreen}
        />
        <Stack.Screen
          options={{title: data && data.title}}
          name="videoDetail"
          component={VideoDetailScreen}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}

function UploadStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        contentStyle: {
          backgroundColor: appColors.screenBg,
        },
      }}>
      <Stack.Group
        screenOptions={{
          headerShown: true,
          header: ({options, navigation}) => {
            return (
              <AppHeader
                option={options}
                rightOptions
                onPressNotify={() => {
                  navigation.navigate('notification');
                }}
                onpressSetting={() => {
                  navigation.navigate('categories');
                }}
              />
            );
          },
        }}>
        <Stack.Screen
          options={{title: 'Upload'}}
          name="Upload"
          component={UploadScreen}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}

export {
  EventStack,
  NewsStack,
  InfoStack,
  UploadStack,
  // ImageViewerStack,
  AuthStack,
};
