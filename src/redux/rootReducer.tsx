import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productReducer from './slices/productSlice'; // Pastikan ini sudah benar

const rootReducer = combineReducers({
  auth: authReducer,
  product: productReducer,
  // Tambahkan slice lainnya
});

export default rootReducer;
