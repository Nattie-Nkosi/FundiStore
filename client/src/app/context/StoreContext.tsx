import { PropsWithChildren, createContext, useContext, useState } from "react";
import { Cart } from "../models/cart";

// Defining the shape of the context for our store, which will be used by other components
interface StoreContextValue {
  cart: Cart | null;
  setCart: (cart: Cart) => void;
  removeItem: (productId: number, quantity: number) => void;
}

// Creating a context for our store with the defined shape, initially set to undefined
export const StoreContext = createContext<StoreContextValue | undefined>(
  undefined
);

// Custom hook to use the store context
// eslint-disable-next-line react-refresh/only-export-components
export function useStoreContext(): StoreContextValue {
  // Using the useContext hook to access the StoreContext
  const context = useContext(StoreContext);

  // If the context is undefined, it means we're not within a StoreProvider and an error is thrown
  if (context === undefined) {
    throw new Error("Sorry - we do not seem to be inside the provider");
  }

  // Returning the context so it can be used by the component that called this hook
  return context;
}

// The provider component for our StoreContext which will wrap parts of our app
export function StoreProvider({ children }: PropsWithChildren<unknown>) {
  // State hook to keep track of the cart's state
  const [cart, setCart] = useState<Cart | null>(null);

  // Function to remove an item from the cart
  function removeItem(productId: number, quantity: number) {
    // If there's no cart, there's nothing to do
    if (!cart) return;
    // Creating a new array of items by copying the current cart items
    const items = [...cart.items];
    // Finding the index of the item we want to remove
    const itemIndex = items.findIndex((i) => i.productId === productId);
    // If the item exists in the cart
    if (itemIndex >= 0) {
      // Decrease the quantity of the item
      items[itemIndex].quantity -= quantity;
      // If the quantity reaches zero, remove the item from the cart
      if (items[itemIndex].quantity === 0) items.splice(itemIndex, 1);
      // Update the cart's state with the new items array
      setCart((prevState) => {
        return { ...prevState!, items };
      });
    }
  }

  // The JSX for the StoreProvider component, providing the cart, setCart, and removeItem in its value
  return (
    <StoreContext.Provider value={{ cart, setCart, removeItem }}>
      {children}
    </StoreContext.Provider>
  );
}
