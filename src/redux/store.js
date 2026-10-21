import { configureStore } from "@reduxjs/toolkit";
import TitleSlice from "./TitleSlice";
import authSlice from "./authSlice";
import videoSlice from "./videoSlice";
import SettingSlice from "./SettingSlice";
import globalUseSlice from "./globalUseSlice";
import eventSettingSlice from "./eventSettingSlice";

const store = configureStore({
    reducer:{
        title:TitleSlice,
        auth : authSlice,
        video: videoSlice,
        settings: SettingSlice,
        globalUse:globalUseSlice,
        eventSetting: eventSettingSlice,
    },
});
export default store;