import { useEffect, useState } from "react";
import StoreListElement from "../components/StoreListElement/StoreListElement";
import { getAllProducts } from "../services/api";
import { Link } from "react-router-dom";

export default function ProductsPage() {
  const [productsList, setProductList] = useState([]);
  const fetchProducts = async () => {
    try {
      const data = await getAllProducts();
      setProductList(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <div className="max-w-[1200px] gap-2 grid grid-cols-12 grid-rows-2 px-12 py-12 mx-auto">
        {productsList.map((product) => (
          <StoreListElement key={product._id} item={product} />
        ))}
        <Link to="/register">Register AAAA</Link>
      </div>
    </>
  );
}
