import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../api/axiosConfig';
import Cookies from 'js-cookie';
import { authService } from '../../apiServices/authService';

export const fetchAuthSession = createAsyncThunk(
  'auth/fetchAuthSession',
  async (_, { rejectWithValue }) => {
    try {
      const isAdminContext = window.location.pathname.startsWith('/admin');
      const endpoint = isAdminContext ? '/auth/admin/me' : '/auth/user/me';

      const response = await axiosInstance.get(endpoint);
      return response.data;
    } catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        return rejectWithValue('unauthenticated');
      }
      return rejectWithValue(error.message || 'Network Error');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { getState, dispatch }) => {
    try {
      const state = getState();
      const userId = state.auth.user?._id;
      
      // Perform server-side logout
      await authService.logout(userId);
    } catch (error) {
      console.error("Backend logout failed:", error);
      // Swallow error to ensure local cleanup continues
    } finally {
      // Backend handles HttpOnly cookie removal.
      
      // Reset Redux auth state
      dispatch(logout());
    }
  }
);

const initialState = {
  user: null,
  role: null,
  isAuthenticated: false,
  isInitialized: false,
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.role = null;
      state.isAuthenticated = false;
      state.status = 'idle';
      state.error = null;
    },
    setUnauthenticated: (state) => {
      state.user = null;
      state.role = null;
      state.isAuthenticated = false;
      state.isInitialized = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuthSession.pending, (state) => {
        state.status = 'loading';
        state.isInitialized = false;
        state.error = null;
      })
      .addCase(fetchAuthSession.fulfilled, (state, action) => {
        state.user = action.payload.userData;
        state.role = action.payload.role;
        state.isAuthenticated = true;
        state.isInitialized = true;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(fetchAuthSession.rejected, (state, action) => {
        state.user = null;
        state.role = null;
        state.isAuthenticated = false;
        state.isInitialized = true;
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { logout, setUnauthenticated } = authSlice.actions;
export default authSlice.reducer;
