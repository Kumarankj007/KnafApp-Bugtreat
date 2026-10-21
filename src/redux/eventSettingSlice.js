import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {url} from '../utilities/appApi';

export const settingApi = createAsyncThunk(
  'settingApi',
  async ({fcmToken, userAgent, enter}, {getState, dispatch}) => {
    try {
      // let trigger = 0;
      const state = getState();

      const formdata = new FormData();
      const headers = new Headers();

      formdata.append('deviceid', fcmToken);
      headers.append('User-Agent', userAgent);
      if (enter == 'no' && state.eventSetting.settingData.length > 0) {
        const concatenatedToFollow = state.eventSetting.settingData
          .filter(item => item.to_follow == '1')
          .map(item => item.id)
          .join(',');

        const concatenatedNotify = state.eventSetting.settingData
          .filter(item => item.checked == '1')
          .map(item => item.id)
          .join(',');

        formdata.append('to_follow', concatenatedToFollow);
        formdata.append('category_active', concatenatedNotify);

        // trigger = state.eventSetting.settingTrigger + 1;
      } else {
        formdata.append('to_follow', 'noinput');
        formdata.append('category_active', 'noinput');
      }
      const response = await fetch(url().categoryStatus, {
        method: 'POST',
        body: formdata,
        headers: headers,
      });
      
      // console.log(formdata, 'formdata');
      if (response.status == 200) {
        const resparse = await response.json();
        if (state.eventSetting.prevSettingData.length > 0) {
          // console.log(
          //   JSON.stringify(state.eventSetting.settingData, undefined, 2),
          //   'data',
          //   JSON.stringify(state.eventSetting.prevSettingData, undefined, 2),
          //   'datas',
          // );
          if (
            JSON.stringify(state.eventSetting.prevSettingData) !=
            JSON.stringify(state.eventSetting.settingData)
          ) {
            dispatch(setSettingTrigger());
            dispatch(setPrevSettingData(resparse.data.categories));
          }
          dispatch(setRefreshControll(false));
        } else {
          dispatch(setPrevSettingData(resparse.data.categories));
          dispatch(setRefreshControll(false));
        }
        return resparse.data.categories;
      } else {
        console.log('status code event setting:', response.status);
        dispatch(setRefreshControll(false));
      }
    } catch (error) {
      console.log(error,'setting page error');
      dispatch(setRefreshControll(false));
    }
  },
);

const eventSettingSlice = createSlice({
  name: 'eventSetting',
  initialState: {
    settingData: [],
    prevSettingData: [],
    isLoader: false,
    isError: false,
    settingTrigger: 0,
    refresControll: false,
  },
  extraReducers: builder => {
    builder.addCase(settingApi.pending, (state, action) => {
      state.isLoader = true;
    });
    builder.addCase(settingApi.fulfilled, (state, action) => {
      state.isLoader = false;
      state.settingData = action.payload;
    });
    builder.addCase(settingApi.rejected, (state, action) => {
      state.settingData = [];
      state.isLoader = false;
      state.isError = true;
    });
  },
  reducers: {
    setSettingData: (state, action) => {
      state.settingData = action.payload;
    },
    setPrevSettingData: (state, action) => {
      state.prevSettingData = action.payload;
    },
    setSettingTrigger: (state, action) => {
      state.settingTrigger = state.settingTrigger + 1;
    },
    setRefreshControll: (state, action) => {
      state.refresControll = action.payload;
    },
  },
});

export const {
  setSettingData,
  setSettingTrigger,
  setPrevSettingData,
  setRefreshControll,
} = eventSettingSlice.actions;
export default eventSettingSlice.reducer;
