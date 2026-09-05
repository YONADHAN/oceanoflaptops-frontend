import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartService } from '../../apiServices/userApiServices';

export const fetchCartCountAsync = createAsyncThunk(
  'cart/fetchCartCount',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const user = state.auth.user;
      
      if (!user || !user._id) return { count: 0 };

      const response = await cartService.getCartItems(user._id);
      if (response.data.success && response.data.cartItems) {
        return { count: response.data.cartItems.length };
      }
      return { count: 0 };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    count: 0,
    status: 'idle',
  },
  reducers: {
    setCartCount: (state, action) => {
      state.count = action.payload;
    },
    incrementCartCount: (state) => {
      state.count += 1;
    },
    decrementCartCount: (state) => {
      if (state.count > 0) state.count -= 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartCountAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCartCountAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.count = action.payload.count;
      })
      .addCase(fetchCartCountAsync.rejected, (state) => {
        state.status = 'failed';
        state.count = 0;
      });
  },
});

export const { setCartCount, incrementCartCount, decrementCartCount } = cartSlice.actions;

export default cartSlice.reducer;
