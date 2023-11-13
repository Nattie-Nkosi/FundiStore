import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Cart } from "../../app/models/cart";
import agent from "../../app/api/agent";

interface CartState {
  cart: Cart | null;
  status: string;
}

const initialState: CartState = {
  cart: null,
  status: 'idle'
}

export const addCartItemAsync = createAsyncThunk<Cart, { productId: number, quantity: number }>(
  'cart/addCartItemAsync',
  async ({ productId, quantity }) => {
    try {
      return await agent.Cart.addItem(productId, quantity);
    } catch (error) {
      console.log(error)
    }
  }
);

export const cartSilce = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.cart = action.payload
    },
    removeItem: (state, action) => {
      const { productId, quantity } = action.payload;
      const itemIndex = state.cart?.items.findIndex(i => i.productId === productId);
      if (itemIndex === -1 || itemIndex === undefined) return;
      state.cart!.items[itemIndex].quantity -= quantity;
      if (state.cart!.items[itemIndex].quantity === 0)
        state.cart?.items.splice(itemIndex, 1);
    }
  },
  extraReducers: (builder => {
    builder.addCase(addCartItemAsync.pending, (state, action) => {
      console.log(action);
      state.status = 'pendingAddItem'
    });
    builder.addCase(addCartItemAsync.fulfilled, (state, action) => {
      state.cart = action.payload;
      state.status = 'idle'
    });
    builder.addCase(addCartItemAsync.rejected, (state) => {

      state.status = 'idle'
    });
  })
})

export const { setCart, removeItem } = cartSilce.actions;