import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import companyReducer from '../features/companySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    company: companyReducer,
  },
});