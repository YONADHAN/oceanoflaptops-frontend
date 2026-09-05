import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { wishlistService } from '../../apiServices/userApiServices';

export const fetchWishlistCountAsync = createAsyncThunk(
  'wishlist/fetchWishlistCount',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const user = state.auth.user;
      
      if (!user || !user._id) return { count: 0 };
      
      const response = await wishlistService.getWishlists({ userId: user._id, page: 1, limit: 1000 });
      if (response.data && response.data.totalProducts !== undefined) {
        return { count: response.data.totalProducts };
      }
      return { count: 0 };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    count: 0,
    status: 'idle',
  },
  reducers: {
    setWishlistCount: (state, action) => {
      state.count = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlistCountAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWishlistCountAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.count = action.payload.count;
      })
      .addCase(fetchWishlistCountAsync.rejected, (state) => {
        state.status = 'failed';
        state.count = 0;
      });
  },
});

export const { setWishlistCount } = wishlistSlice.actions;

export default wishlistSlice.reducer;
