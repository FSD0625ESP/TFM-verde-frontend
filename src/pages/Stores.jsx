import { useEffect, useState } from "react";
import StoreListElement from "../components/StoreListElement/StoreListElement";
import { getAllStores } from "../services/api";
import { Link } from "react-router-dom";

export default function StoresPage() {
  const [storesList, setStoresList] = useState([]);
  const fetchStores = async () => {
    try {
      const data = await getAllStores();
      setStoresList(data);
    } catch (error) {
      console.error("Error fetching stores:", error);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  return (
    <>
      <div className="max-w-[1200px] gap-2 grid grid-cols-12 grid-rows-2 px-12 py-12 mx-auto">
        {storesList.map((store) => (
          <StoreListElement key={store._id} store={store} />
        ))}
        <Link to="/register">Register AAAA</Link>
      </div>
    </>
  );
}
