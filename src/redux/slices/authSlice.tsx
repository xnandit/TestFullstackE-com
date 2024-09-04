import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  role: 'administrator' | 'customer' | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  role: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<{ token: string; role: 'administrator' | 'customer' }>) {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.role = action.payload.role;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.token = null;
      state.role = null;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;

export default authSlice.reducer;
