import { useEffect, useState } from "react";
import { Cart } from "../../app/models/cart";
import agent from "../../app/api/agent";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { Typography } from "@mui/material";

export default function CartPage() {
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<Cart | null>(null);

  useEffect(() => {
    agent.cart
      .get()
      .then((cart) => setCart(cart))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingComponent message="Loading cart..." />;

  if (!cart) return <Typography variant="h3">Your cart is empty</Typography>;

  return <h1>Buyer Id = {cart.buyerId}</h1>;
}
