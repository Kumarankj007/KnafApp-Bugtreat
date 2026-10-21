import {createSlice} from '@reduxjs/toolkit';

const TitleSlice = createSlice({
  name: 'title',
  initialState: {
    title: 'Klasse',
    tabtitle: '',
    faqTitle: '',
    newsTitle: '',
    readerTitle: '',
  },
  reducers: {
    setTitle: (state, action) => {
      state.title = action.payload;
    },
    setTabTitle: (state, action) => {
      state.tabtitle = action.payload;
    },
    setFaqTitle: (state, action) => {
      state.faqTitle = action.payload;
    },
    setNewsTitle: (state, action) => {
      state.newsTitle = action.payload;
    },
    setReaderTitle: (state, action) => {
      state.readerTitle = action.payload;
    },
  },
});

export const {
  setTitle,
  setTabTitle,
  setFaqTitle,
  setNewsTitle,
  setReaderTitle,
} = TitleSlice.actions;
export default TitleSlice.reducer;
