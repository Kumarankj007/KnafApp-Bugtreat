import { createSlice } from "@reduxjs/toolkit";

const VideoSlice = createSlice({
    name: 'video',
    initialState: {
      data:null
    },
    reducers: {
      setData: (state, action) => {
        state.data = action.payload;
      },
     
    },
  });
  
  export const {setData} = VideoSlice.actions;
  export default VideoSlice.reducer;