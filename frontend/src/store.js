import { configureStore } from '@reduxjs/toolkit';
import themeReducer from 'src/slices/theme';

export default configureStore({
  reducer: {
    themeReducer,
  },
});
