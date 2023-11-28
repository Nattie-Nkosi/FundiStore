import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Cart } from "../../app/models/cart";
import agent from "../../app/api/agent";

// Defining the shape of our cart's state with TypeScript.
interface CartState {
  cart: Cart | null; // The cart can be a Cart object or null if empty.
  status: string;
}

// Setting the initial state of the cart.
const initialState: CartState = {
  cart: null,
  status: 'idle' // Initial status is 'idle', meaning no current operations.
}

// Creating an asynchronous thunk for adding items to the cart.
export const addCartItemAsync = createAsyncThunk<Cart, { productId: number, quantity?: number }>(
  'cart/addCartItemAsync', // Naming this thunk for reference.
  async ({ productId, quantity = 1 }, thunkAPI) => {
    try {
      // Attempt to add an item to the cart via the API.
      return await agent.Cart.addItem(productId, quantity);
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data })
    }
  }
);

export const removeCartItemAsync = createAsyncThunk<void,
  { productId: number, quantity: number, name?: string }>(
    `cart/removeCartItemAsync`,
    async ({ productId, quantity }, thunkAPI) => {
      try {
        return await agent.Cart.removeItem(productId, quantity);
      } catch (error: any) {
        return thunkAPI.rejectWithValue({ error: error.data })
      }
    }
  );

// Creating a slice for the cart with various reducers and extra reducers.
export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.cart = action.payload
    }
  },
  extraReducers: (builder => {
    builder.addCase(addCartItemAsync.pending, (state, action) => {
      state.status = 'pendingAddItem' + action.meta.arg.productId;
    });
    builder.addCase(addCartItemAsync.fulfilled, (state, action) => {
      state.cart = action.payload;
      state.status = 'idle'
    });
    builder.addCase(addCartItemAsync.rejected, (state, action) => {
      state.status = 'idle'
      console.log(action.payload);
    });
    builder.addCase(removeCartItemAsync.pending, (state, action) => {
      state.status = 'pendingRemoveItem' + action.meta.arg.productId + action.meta.arg.name;
    });
    builder.addCase(removeCartItemAsync.fulfilled, (state, action) => {
      const { productId, quantity } = action.meta.arg;
      const itemIndex = state.cart?.items.findIndex(i => i.productId === productId);
      if (itemIndex === -1 || itemIndex === undefined) return;
      state.cart!.items[itemIndex].quantity -= quantity;
      if (state.cart?.items[itemIndex].quantity === 0)
        state.cart.items.splice(itemIndex, 1);
      state.status = 'idle';
    });
    builder.addCase(removeCartItemAsync.rejected, (state, action) => {
      state.status = 'idle';
      console.log(action.payload);
    })
  })
})

export const { setCart } = cartSlice.actions;
