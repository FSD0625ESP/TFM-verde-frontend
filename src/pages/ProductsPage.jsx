import { useEffect, useState } from "react";
import Slider from "../components/Slider/Slider";
import {
  getAllFeaturedProducts,
  getAllStores,
  getAllCategories,
} from "../services/api";
import Filters from "../components/Filters/Filters";

export default function ProductsPage() {
  const [featuredProductsList, setFeaturedProductsList] = useState([]);
  const fetchFeaturedProducts = async () => {
    try {
      const data = await getAllFeaturedProducts();
      setFeaturedProductsList(data);
      console.log("featuredProducts", data);
    } catch (error) {
      console.error("Error fetching featured products:", error);
    }
  };

  const [storesList, setStoresList] = useState([]);
  const fetchStores = async () => {
    try {
      const data = await getAllStores();
      setStoresList(data);
    } catch (error) {
      console.error("Error fetching stores:", error);
    }
  };

  const [categoriesList, setCategoriesList] = useState([]);
  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategoriesList(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchFeaturedProducts();
    fetchStores();
    fetchCategories();
    console.log("useEffect launched in ProductsPage");
  }, []);

  return (
    <>
      <div className="w-full">
        <Slider items={featuredProductsList} type="product" numSlides={1} />
      </div>
      <div className="w-full bg-primary">
        <div className="container px-8 py-8 mx-auto">
          <Slider items={featuredProductsList} type="product" numSlides={4} />
        </div>
      </div>

      {categoriesList.length > 0 && storesList.length > 0 && (
        <Filters
          categoriesList={categoriesList}
          storesList={storesList}
          mode="products"
          showTabs={false}
        />
      )}
    </>
  );
}
