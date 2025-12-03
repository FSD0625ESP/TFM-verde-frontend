import { useEffect, useState } from "react";
import Slider from "../components/Slider/Slider";
import { getAllStores, getAllCategories } from "../services/api";
import Filters from "../components/Filters/Filters";

export default function StoresPage() {
  const [storesList, setStoresList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);

  const fetchStores = async () => {
    try {
      const data = await getAllStores();
      setStoresList(data);
    } catch (error) {
      console.error("Error fetching stores:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategoriesList(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchStores();
    fetchCategories();
  }, []);

  return (
    <>
      <div className="w-full">
        <Slider items={storesList} type="store" numSlides={1} />
      </div>
      <div className="w-full bg-primary">
        <div className="container px-8 py-8 mx-auto">
          <Slider items={storesList} type="store" numSlides={4} />
        </div>
      </div>

      {categoriesList.length > 0 && storesList.length > 0 && (
        <Filters
          categoriesList={categoriesList}
          storesList={storesList}
          mode="stores"
          showTabs={false}
        />
      )}
    </>
  );
}
