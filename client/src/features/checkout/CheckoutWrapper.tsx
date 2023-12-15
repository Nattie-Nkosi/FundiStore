import { Elements } from "@stripe/react-stripe-js";
import CheckoutPage from "./CheckoutPage";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51OMxpbFpTRtzNIWIj5IfsYlL8SNSyft5LSP2cDW2icdpxUqCxRL3ls0O9pViZlztCLBpQJh8L4i9u25gxgUkt8NB004S1RHIM5"
);

export default function CheckoutWrapper() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutPage />
    </Elements>
  );
}
