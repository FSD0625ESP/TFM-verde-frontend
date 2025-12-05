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
import ChatDebugButtons from "../components/Chat/ChatDebugButtons";

const Home = () => {
  const { user } = React.useContext(AuthContext);
  const [storesList, setStoresList] = useState([]);
  const [loading, setLoading] = useState(true);

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
    setLoading(false);
  }, []);

  return (
    <>
      {/* <ChatDebugButtons /> */}
      <div className="w-full">
        {/* {storesList && storesList.length > 0 ? (
          <Slider items={storesList} type="store" numSlides={1} />
        ) : (
          <p>no hay tiendas</p>
        )} */}
        {loading ? (
          // skeleton loader
          <div className="flex items-center justify-center w-full">
            <div className="animate-pulse bg-secondary h-100 w-full flex items-center justify-center">
              <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
              </svg>
            </div>
          </div>
        ) : storesList && storesList.length > 0 ? (
          <Slider items={storesList} type="store" numSlides={1} />
        ) : (
          <p>Aún no hay tiendas disponibles</p>
        )}
      </div>

      <div className="w-full bg-primary">
        <div className="container  px-8 py-8 mx-auto grid gap-6 sm:gap-3 md:gap-4 lg-gap-5 grid-cols-12">
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

      <div className="w-full bg-white py-3 sm:py-4 md:py-6 lg:py-8">
        <div className="container px-3 sm:px-4 md:px-6 lg:px-8 mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-semibold mb-4">Tiendas Populares</h2>
            <p className="text-gray-600 text-base">
              Explora las tiendas favoritas de nuestros usuarios para encontrar
              productos de alta calidad.
            </p>
          </div>
          {loading ? (
            <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="animate-pulse bg-secondary rounded-lg h-48">
                  <div className="h-32 bg-gray-300 rounded-t-lg"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : storesList && storesList.length > 0 ? (
            <div className="w-full grid gap-4 sm:gap-5 md:gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {storesList.map((store) => (
                <ListElement key={store._id} type="store" item={store} />
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No hay tiendas disponibles</p>
          )}
        </div>
      </div>
      <div className="w-full bg-primary">
        <div className="container px-8 py-8 mx-auto">
          <h2 className="text-3xl font-semibold mb-4 text-white">
            Productos en Oferta
          </h2>
          {loading ? (
            // skeleton loader
            <div className="grid grid-cols-4 items-center justify-center">
              {[...Array(4)].map((_, index) => (
                <div className="animate-pulse bg-secondary rounded-lg h-48 mx-2">
                  <div className="h-32 bg-gray-300 rounded-t-lg"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : offerProductsList && offerProductsList.length > 0 ? (
            <Slider items={offerProductsList} numSlides={4} type="product" />
          ) : (
            <p className="text-white">No hay productos en oferta</p>
          )}
        </div>
      </div>
      <div className="w-full bg-white py-3 sm:py-4 md:py-6 lg:py-8">
        <div className="container px-3 sm:px-4 md:px-6 lg:px-8 mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-semibold mb-4">Productos Destacados</h2>
            <p className="text-gray-600 text-base">
              Explore nuestra diversa gama de productos destacados.
            </p>
          </div>
          {loading ? (
            <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="animate-pulse bg-secondary rounded-lg h-48">
                  <div className="h-32 bg-gray-300 rounded-t-lg"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : featuredProductsList && featuredProductsList.length > 0 ? (
            <div className="w-full grid gap-4 sm:gap-5 md:gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {featuredProductsList.map((product) => (
                <ListElement key={product._id} type="product" item={product} />
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No hay productos destacados disponibles</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
