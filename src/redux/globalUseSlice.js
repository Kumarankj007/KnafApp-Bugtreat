import {createSlice} from '@reduxjs/toolkit';

const globalUseSlice = createSlice({
  name: 'globalUse',
  initialState: {
    licenseUpdate: [],
    notifeeDeleteModal: false,
    notifeeTrigger: 0,
    infoContentTrigger: 0,
    notifeeMessageLength: false,
  },
  reducers: {
    setLicenseUpdate: (state, action) => {
      state.licenseUpdate = action.payload;
    },
    setNotifeeDeleteModal: (state, action) => {
      state.notifeeDeleteModal = action.payload;
    },
    setNotifeeMessageLength: (state, action) => {
      state.notifeeMessageLength = action.payload;
    },
    setNotifeeTrigger: (state, action) => {
      state.notifeeTrigger = action.payload;
    },
    setInfoContentTrigger: (state, action) => {
      state.infoContentTrigger = action.payload;
    },
  },
});

export const {
  setLicenseUpdate,
  setNotifeeDeleteModal,
  setNotifeeTrigger,
  setInfoContentTrigger,
  setNotifeeMessageLength,
} = globalUseSlice.actions;
export default globalUseSlice.reducer
