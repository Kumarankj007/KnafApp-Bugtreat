import {createSlice} from '@reduxjs/toolkit';

const settingSlice = createSlice({
  name: 'settings',
  initialState: {
    fcmToken: '',
    devId: '',
    userAgent: '',
    sliderContent: [],
    infoContent: {},
    updateNeeded: false,
    newsFeed: [],
  },
  reducers: {
    setFcmToken: (state, action) => {
      state.fcmToken = action.payload;
    },
    setDevId: (state, action) => {
      state.devId = action.payload;
    },
    setSliderContent: (state, action) => {
      state.sliderContent = action.payload;
    },
    setUserAgent: (state, action) => {
      state.userAgent = action.payload;
    },
    setInfoContent: (state, action) => {
      state.infoContent = action.payload;
    },
    setUpdateNeeded: (state, action) => {
      state.updateNeeded = action.payload;
    },
    setNewsFeed: (state, action) => {
      state.newsFeed = action.payload;
    },
  },
});

export const {
  setDevId,
  setUserAgent,
  setSliderContent,
  setInfoContent,
  setUpdateNeeded,
  setNewsFeed,
  setFcmToken,
} = settingSlice.actions;
export default settingSlice.reducer;
