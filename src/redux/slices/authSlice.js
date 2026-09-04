import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../api/axiosConfig';

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
