import React, {useState, useEffect, useCallback} from 'react';
import {View, RefreshControl} from 'react-native';
import {TopEventButton} from '../../components/Buttons/TopEventButton';
import {Toekomst, Verledan} from './EventOverview';
import {url} from '../../utilities/appApi';
import {useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';
import { print } from '../../utilities/HelpeFunction';

export default function EventScreen() {
  const [selection, setSelection] = useState(1);
  const {fcmToken, userAgent} = useSelector(state => state.settings);
  const {settingTrigger} = useSelector(state => state.eventSetting);
  const [loading, setLoading] = useState(false);
  const [loadinge2, setLoadinge2] = useState(false);
  const [eventOverview1, setEventOverview1] = useState({
    data: [],
    pushStart: 0,
    limit: 6,
    count: 0,
    page: 0,
  });
  const [refreshing1, setRefreshing1] = useState(false);
  const [refreshing2, setRefreshing2] = useState(false);
  const [event1Start, setEvent1Start] = useState(0);
  const [eventOverview2, setEventOverview2] = useState({
    data: [],
    pushStart: 0,
    limit: 6,
    count: 0,
    page: 0,
  });
  const [event2Start, setEvent2Start] = useState(0);
  const [settingUpdation, setSettingTrigger] = useState(0);

  const switchSelection = select => {
    setSelection(select);
  };

  const onRefresh1 = useCallback(() => {
    setEventOverview1(preData => ({
      data: preData.data,
      pushStart: 0,
      limit: 0,
      count: 0,
      page: 0,
    }));
    setEvent1Start(0);
    setRefreshing1(true);
  }, []);

  const onRefresh2 = useCallback(() => {
    setEventOverview2(preData => ({
      data: preData.data,
      pushStart: 0,
      limit: 0,
      count: 0,
      page: 0,
    }));
    setEvent2Start(0);
    setRefreshing2(true);
  }, []);

  const triggerEvent1 = async () => {
    if (userAgent && userAgent != '') {
      try {
        if (eventOverview1.data.length == 0 && !refreshing1) {
          setLoading(true);
        }
        const headers = new Headers();
        const formData = new FormData();

        headers.append('User-Agent', userAgent);

        formData.append('mode', 'upcoming_events');
        formData.append('start', refreshing1 ? 0 : event1Start);
        formData.append('deviceid', fcmToken);
        print(url().eventOverview, 'eventOverview');
        const response = await fetch(url().eventOverview, {
          method: 'POST',
          body: formData,
          headers: headers,
        });

        if (response.status == 200) {
          const resparse = await response.json();
          if (resparse.data) {
            // console.log(JSON.stringify(resparse, undefined, 2), 'resparse');
            setEventOverview1(prevdata => {
              return {
                data: refreshing1
                  ? resparse.data
                  : [...prevdata.data, ...resparse.data],
                pushStart: Number(resparse.start),
                limit: Number(resparse.limit),
                count: Number(resparse.count),
                page: refreshing1 ? 1 : Number(prevdata.page + 1),
              };
            });
            setRefreshing1(false);
            setLoading(false);
            SplashScreen.hide();
          } else {
            console.log('empty event data');
            setRefreshing1(false);
            setLoading(false);
            SplashScreen.hide();
          }
        } else {
          console.log('Status code (EO1):', response.status);
          setRefreshing1(false);
          setLoading(false);
          SplashScreen.hide();
        }
      } catch (error) {
        console.log(error, 'eventoverview 1 has error');
        setRefreshing1(false);
        setLoading(false);
        SplashScreen.hide();
      }
    }
  };

  const triggerEvent2 = async () => {
    if (userAgent && userAgent != '') {
      try {
        if (eventOverview2.data.length == 0 && !refreshing2) {
          setLoadinge2(true);
        }
        const headers = new Headers();
        const formData = new FormData();
        headers.append('User-Agent', userAgent);

        formData.append('mode', 'completed_events');
        formData.append('start', refreshing2 ? 0 : event2Start);
        formData.append('deviceid', fcmToken);

        const response = await fetch(url().eventOverview, {
          method: 'POST',
          body: formData,
          headers: headers,
        });

        if (response.status == 200) {
          const resparse = await response.json();
          if (resparse.data) {
            setEventOverview2(prevdata => {
              return {
                data: refreshing2
                  ? resparse.data
                  : [...prevdata.data, ...resparse.data],
                pushStart: Number(resparse.start),
                limit: Number(resparse.limit),
                count: Number(resparse.count),
                page: refreshing2 ? 1 : Number(prevdata.page + 1),
              };
            });
            // console.log(JSON.stringify(resparse.data[1], undefined, 2), 'event2');
            setRefreshing2(false);
            setLoadinge2(false);
          } else {
            console.log('empty event data');
            setRefreshing2(false);
            setLoadinge2(false);
          }
        } else {
          console.log('Status code (EO2):', response.status);
          setRefreshing2(false);
          setLoadinge2(false);
        }
      } catch (error) {
        console.log(error, 'eventoverview has error');
        setRefreshing2(false);
        setLoadinge2(false);
      }
    }
  };

  const eventpaging1 = () => {
    setEvent1Start(
      Number(eventOverview1.pushStart) + Number(eventOverview1.limit),
    );
  };

  const eventpaging2 = () => {
    setEvent2Start(
      Number(eventOverview2.pushStart) + Number(eventOverview2.limit),
    );
  };

  // during tab change
  useEffect(() => {
    if (
      fcmToken &&
      fcmToken != '' &&
      selection == 1 &&
      eventOverview1.data.length == 0 &&
      !refreshing1
    ) {
      triggerEvent1();
    } else if (
      fcmToken &&
      fcmToken != '' &&
      selection == 2 &&
      eventOverview2.data.length == 0 &&
      !refreshing2
    ) {
      triggerEvent2();
    }
  }, [selection, fcmToken]);

  // during pull to refresh
  useEffect(() => {
    if (fcmToken && fcmToken != '' && selection == 1 && refreshing1) {
      triggerEvent1();
    } else if (fcmToken && fcmToken != '' && selection == 2 && refreshing2) {
      triggerEvent2();
    }
  }, [refreshing1, refreshing2]);

  // during pagination call:
  useEffect(() => {
    if (
      selection == 1 &&
      eventOverview1.count > 0 &&
      eventOverview1.data.length > 0 &&
      !refreshing1
    ) {
      triggerEvent1();
    } else if (
      selection == 2 &&
      eventOverview2.count > 0 &&
      eventOverview2.data.length > 0 &&
      !refreshing2
    ) {
      triggerEvent2();
    }
  }, [event1Start, event2Start]);

  // during setting local trigger to refresh
  useEffect(() => {
    if (fcmToken && fcmToken != '' && settingTrigger > 0) {
      if (selection == 1) {
        triggerEvent1();
      } else if (selection == 2) {
        triggerEvent2();
      }
    }
  }, [settingUpdation]);

  // during setting trigger update
  useEffect(() => {
    if (settingTrigger > 0) {
      setEventOverview1({
        data: [],
        pushStart: 0,
        limit: 6,
        count: 0,
        page: 0,
      });
      setEvent1Start(0);
      setEventOverview2({
        data: [],
        pushStart: 0,
        limit: 6,
        count: 0,
        page: 0,
      });
      setEvent2Start(0);
    }
    setSettingTrigger(settingUpdation + 1);
  }, [settingTrigger]);

  return (
    <View style={{flex: 1}}>
      <View style={{paddingHorizontal: 30, alignItems: 'center'}}>
        <TopEventButton
          switchOne={'Actueel'}
          switchTwo={'Verleden'}
          onSelect={switchSelection}
          activeSwitch={selection}
        />
      </View>
      <View style={{flex: 1, paddingHorizontal: 15, paddingVertical: 20}}>
        {selection == 1 && (
          <Toekomst
            eventOverview1={eventOverview1}
            triggerEvent1={triggerEvent1}
            paging={eventpaging1}
            loading={loading}
            refreshing={refreshing1}
            onRefresh={onRefresh1}
          />
        )}
        {selection == 2 && (
          <Verledan
            eventOverview2={eventOverview2}
            triggerEvent2={triggerEvent2}
            paging={eventpaging2}
            loading={loadinge2}
            refreshing={refreshing2}
            onRefresh={onRefresh2}
          />
        )}
      </View>
    </View>
  );
}
