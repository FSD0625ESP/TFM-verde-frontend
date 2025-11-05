import { AuthContext } from "../contexts/AuthContext";
import React, { useEffect, useState } from "react";
import Slider from "../components/Slider/Slider";
import RegisterIlustration from "../assets/register_ilustration.png";
import ListElement from "../components/ListElement/ListElement";
import {
  getAllStores,
  getAllFeaturedProducts,
  getAllOfferProducts,
} from "../services/api";

const Home = () => {
  const { user } = React.useContext(AuthContext);

  const [storesList, setStoresList] = useState([]);
  const fetchStores = async () => {
    try {
      const data = await getAllStores();
      setStoresList(data);
    } catch (error) {
      console.error("Error fetching stores:", error);
    }
  };

  const [featuredProductsList, setFeaturedProductsList] = useState([]);
  const fetchFeaturedProducts = async () => {
    try {
      const data = await getAllFeaturedProducts();
      setFeaturedProductsList(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const [offerProductsList, setOfferProductsList] = useState([]);
  const fetchOfferProducts = async () => {
    try {
      const data = await getAllOfferProducts();
      setOfferProductsList(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchStores();
    fetchFeaturedProducts();
    fetchOfferProducts();
  }, []);

  return (
    <>
      <div>
        {user ? (
          <p>Welcome, {user.firstName}!</p>
        ) : (
          <p>Please log in to access more features.</p>
        )}
      </div>
      <div className="w-full">
        <Slider items={storesList} numSlides={1} />
      </div>

      <div className="w-full bg-primary">
        <div className="max-w-[1536px] px-8 py-8 mx-auto grid gap-6 sm:gap-3 md:gap-4 lg-gap-5 grid-cols-12">
          <div className="col-span-12 sm:col-span-6 flex flex-col justify-center">
            <h1 className="text-4xl font-bold text-white">
              Bienvenido a Meraki
            </h1>
            <p className="text-lg text-white/90 mt-4">
              Tu plataforma para descubrir y comprar productos artesanales
              únicos de tiendas locales.
            </p>
            <p className="text-lg text-white/90 mt-4">
              Descubre las mejores tiendas artesanales en un solo lugar.
            </p>
          </div>
          <div className="col-span-12 sm:col-span-6 justify-center">
            <img
              className="col-span-6 mx-auto"
              src={RegisterIlustration}
              alt="Young woman holding a small terracotta potted plant with green leaves, standing against a plain light background; she has a gentle, content expression conveying care and calm. No visible text"
            />
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1536px] gap-6 sm:gap-3 md:gap-4 lg-gap-5 grid grid-cols-12 grid-rows-2 px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6 lg:py-8 mx-auto">
        <div className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3 flex flex-col justify-center bg-secondary p-4 rounded-lg">
          <h2 className="text-white text-3xl font-semibold mb-4">
            Tiendas Populares
          </h2>
          <p className="text-white text-base">
            Explora las tiendas favoritas de nuestros usuarios para encontrar
            productos de alta calidad.
          </p>
        </div>
        {storesList.map((store) => (
          <ListElement key={store._id} item={store} type="store" />
        ))}
      </div>
      <div className="w-full bg-primary">
        <div className="max-w-[1536px] px-8 py-8 mx-auto">
          <Slider items={offerProductsList} numSlides={4} type="product" />
        </div>
      </div>
      <div className="w-full max-w-[1536px] gap-6 sm:gap-3 md:gap-4 lg-gap-5 grid grid-cols-12 grid-rows-2 px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6 lg:py-8 mx-auto">
        <div className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3 flex flex-col justify-center bg-secondary/60 p-4 rounded-lg">
          <h2 className="text-3xl font-semibold mb-4">Productos Destacados</h2>
          <p className="text-black/60 text-base">
            Explore nuestra diversa gama de productos destacados.
          </p>
        </div>
        {featuredProductsList.map((product) => (
          <ListElement key={product._id} type="product" item={product} />
        ))}
      </div>
    </>
  );
};

export default Home;