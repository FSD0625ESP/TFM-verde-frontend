import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "../components/Slider/Slider";
import ListElement from "../components/ListElement/ListElement";
import { getAllStores } from "../services/api";

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
      <div className="w-full">
        <Slider items={storesList} type="store" numSlides={1} />
      </div>
      <div className="w-full bg-primary">
        <div className="max-w-[1536px] px-8 py-8 mx-auto">
          <Slider items={storesList} type="store" numSlides={4} />
        </div>
      </div>
      <div className=" max-w-[1536px] gap-6 sm:gap-3 md:gap-4 lg-gap-5 grid grid-cols-12 px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6 lg:py-8 mx-auto">
        <aside className="sticky top-[88px] self-start col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3 flex flex-col justify-start bg-primary/40 p-4 rounded-lg">
          <h2 className="text-3xl font-semibold mb-4">All Stores</h2>
          <p className="text-black/60 text-base">
            Explore our diverse range of stores offering a variety of products
            and services to cater to your needs.
          </p>
        </aside>
        <div className="col-span-12 sm:col-span-6 md:col-span-8 lg:col-span-9 gap-6 sm:gap-3 md:gap-4 lg-gap-5 grid grid-cols-6 sm-grid-cols-12 md:grid-cols-8 lg:grid-cols-9">
          {storesList.map((store) => (
            <ListElement key={store._id} item={store} type="store" />
          ))}
        </div>
      </div>
      <Link to="/register">Register AAAA</Link>
    </>
  );
}
