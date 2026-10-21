import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {FAQ} from '../../utilities/dummyData';
import {ThemeCard} from '../../components/Cards/ThemeCard';
import {appColors} from '../../utilities/appColors';
import {appFont} from '../../utilities/appFonts';
import {fontScalling} from '../../utilities/HelpeFunction';
import {Icon} from '../../utilities/AppIcons';
import {useDispatch, useSelector} from 'react-redux';
import {setFaqTitle} from '../../redux/TitleSlice';
import {url} from '../../utilities/appApi';
import {setInfoContent} from '../../redux/SettingSlice';

export default function FAQScreen({navigation}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchData, setSearchData] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const {infoContent, userAgent} = useSelector(state => state.settings);

  useEffect(() => {
    setSearchTerm('');
    searchFaq();
  }, []);

  const searchFaq = async () => {
    if (userAgent && userAgent != '') {
      try {
        setLoading(true);
        const formData = new FormData();
        const headers = new Headers();
        headers.append('User-Agent', userAgent);
        formData.append('search', searchTerm);
        const response = await fetch(url().infoContent, {
          method: 'POST',
          body: formData,
          headers: headers,
        });
        if (response.status == 200) {
          const resparse = await response.json();

          if (resparse.data) {
            dispatch(setInfoContent(resparse.data));
            setLoading(false);
          } else {
            console.log('empty info data');
            setLoading(false);
          }
        }
      } catch (error) {
        console.log(error, 'search error');
        setLoading(false);
      }
    }
  };

  return (
    <View style={{flex: 1}}>
      <View>
        <ThemeCard
          altStyle={{marginBottom: 20}}
          children={
            <View style={styles.container}>
              <View style={{flex: 1}}>
                <TextInput
                  placeholder="Zoeken ..."
                  placeholderTextColor={appColors.grayBlack}
                  onChangeText={text => setSearchTerm(text)}
                  style={{
                    color: appColors.textBlack,
                    fontFamily: appFont.Lato_Bold,
                    padding: 0,
                    margin: 0,
                  }}
                />
              </View>
              <Pressable style={{padding: 5}} onPress={() => searchFaq()}>
                <Icon
                  ComponentName={'Ionicons'}
                  name={'search'}
                  color={appColors.grayBlack}
                  size={20}
                />
              </Pressable>
            </View>
          }
        />
      </View>
      {loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color={appColors.textBlack} />
        </View>
      ) : infoContent.faqs && Object.keys(infoContent.faqs).length > 0 ? (
        <FlatList
          data={infoContent.faqs}
          keyExtractor={(item, index) => index}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => {
            return (
              <View key={item.id}>
                <ThemeCard
                  children={
                    <View>
                      <Pressable
                        style={styles.container}
                        onPress={() => {
                          navigation.navigate('FAQdetails', {
                            category: item.faqs,
                          });
                          dispatch(setFaqTitle(item.category_name));
                        }}>
                        <View style={{flex: 1}}>
                          <Text style={styles.title}>{item.category_name}</Text>
                        </View>
                        <View>
                          <Icon
                            ComponentName={'Feather'}
                            name={'chevron-right'}
                            color={appColors.textBlack}
                            size={22}
                          />
                        </View>
                      </Pressable>
                    </View>
                  }
                />
              </View>
            );
          }}
          ListFooterComponent={<View style={{marginBottom: 80}} />}
        />
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text
            style={{fontFamily: appFont.Lato_Bold, color: appColors.textBlack}}>
            No data found
          </Text>
        </View>
      )}
      <View style={{marginBottom: 70}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: appColors.textBlack,
    fontFamily: appFont.Lato_Bold,
    fontSize: fontScalling(1.7),
  },
});
