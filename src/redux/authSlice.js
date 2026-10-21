import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loginStatus: false,
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoggedIn: (state, action) => {
      state.isLoggedIn = true;
    },
    setLoginStatus: (state, action) => {
      state.loginStatus = action.payload;
     // Save login status to AsyncStorage
    },
  },
});

export const { setLoginStatus, setLoggedIn } = authSlice.actions;
export default authSlice.reducer;