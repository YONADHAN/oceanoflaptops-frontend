import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartService } from '../../apiServices/userApiServices';
import Cookies from 'js-cookie';
import { jwtDecode as jwt_decode } from 'jwt-decode';

export const fetchCartCountAsync = createAsyncThunk(
  'cart/fetchCartCount',
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get("access_token") || Cookies.get("user_access_token");
      if (!token) return { count: 0 };

      const decoded = jwt_decode(token);
      if (!decoded || !decoded._id) return { count: 0 };

      const response = await cartService.getCartItems(decoded._id);
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
