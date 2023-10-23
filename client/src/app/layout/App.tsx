import { useEffect, useState } from "react";
import { Product } from "../models/product";
import Catalog from "../../features/Catalog/catalog";
import { Typography } from "@mui/material";

function App() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  function addProduct() {
    setProducts((prevState) => [
      ...prevState,
      {
        id: prevState.length + 101,
        name: "product" + (prevState.length + 1),
        price: prevState.length * 100 + 100,
        brand: "some brand",
        description: "some description",
        pictureUrl: "http://aws.products.com",
      },
    ]);
  }

  return (
    <div>
      <Typography variant="h1">FundiStore</Typography>
      <Catalog products={products} addProduct={addProduct} />
    </div>
  );
}

export default App;
