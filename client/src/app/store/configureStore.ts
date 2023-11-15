import { configureStore } from "@reduxjs/toolkit";
import { counterSlice } from "../../features/Contact/counterSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { cartSilce } from "../../features/Cart/cartSlice";
import { catalogSlice } from "../../features/Catalog/CatalogSlice";

export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
    cart: cartSilce.reducer,
    catalog: catalogSlice.reducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;