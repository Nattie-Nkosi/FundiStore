import { createBrowserRouter } from "react-router-dom";
import HomePage from "../../features/Home/HomePage";
import App from "../layout/App";
import Catalog from "../../features/Catalog/Catalog";
import ProductDetails from "../../features/Catalog/ProductDetails";
import ContactPage from "../../features/Contact/ContactPage";
import AboutPage from "../../features/About/AboutPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <HomePage /> },
      { path: "catalog", element: <Catalog /> },
      { path: "about", element: <AboutPage /> },
      { path: "catalog/:id", element: <ProductDetails /> },
      { path: "contact", element: <ContactPage /> },
    ],
  },
]);
