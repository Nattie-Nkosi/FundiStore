import { Navigate, createBrowserRouter } from "react-router-dom";
import HomePage from "../../features/Home/HomePage";
import App from "../layout/App";
import Catalog from "../../features/Catalog/Catalog";
import ProductDetails from "../../features/Catalog/ProductDetails";
import ContactPage from "../../features/Contact/ContactPage";
import AboutPage from "../../features/About/AboutPage";
import ServerError from "../errors/ServerError";
import NotFound from "../errors/NotFound";
import CartPage from "../../features/Cart/CartPage";
import CheckoutPage from "../../features/checkout/CheckoutPage";
import Login from "../../features/account/Login";
import Register from "../../features/account/Register";
import RequireAuth from "./RequireAuth";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <RequireAuth />,
        children: [{ path: "checkout", element: <CheckoutPage /> }],
      },
      { path: "", element: <HomePage /> },
      { path: "catalog", element: <Catalog /> },
      { path: "about", element: <AboutPage /> },
      { path: "catalog/:id", element: <ProductDetails /> },
      { path: "contact", element: <ContactPage /> },
      { path: "server-error", element: <ServerError /> },
      { path: "not-found", element: <NotFound /> },
      { path: "cart", element: <CartPage /> },

      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "*", element: <Navigate replace to="/not-found" /> },
    ],
  },
]);
