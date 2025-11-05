import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "../components/Slider/Slider";
import ListElement from "../components/ListElement/ListElement";
import {
  getAllProducts,
  getAllFeaturedProducts,
  getAllCategories,
} from "../services/api";

export default function ProductsPage() {
  const [productsList, setProductsList] = useState([]);
  const fetchProducts = async () => {
    try {
      const data = await getAllProducts();
      setProductsList(data);
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
      console.error("Error fetching featured products:", error);
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
    fetchProducts();
    fetchFeaturedProducts();
    fetchCategories();
    console.log("useEffect launched");
  }, []);

  const filterByCategory = (category) => {
    const filteredProducts = productsList.filter((product) =>
      product.categories.includes(category)
    );
    console.log(category, filteredProducts);
    setProductsList(filteredProducts);
  };

  const filterByOffer = (isOffer) => {
    const filteredProducts = productsList.filter(
      (product) => product.oferta === isOffer
    );
    setProductsList(filteredProducts);
  };

  const filterByPrice = (min, max) => {
    const filteredProducts = productsList.filter(
      (product) => product.price >= min && product.price <= max
    );
    setProductsList(filteredProducts);
  };

  return (
    <>
      <div className="w-full">
        <Slider items={featuredProductsList} type="product" numSlides={1} />
      </div>
      <div className="w-full bg-primary">
        <div className="max-w-[1536px] px-8 py-8 mx-auto">
          <Slider items={featuredProductsList} type="product" numSlides={4} />
        </div>
      </div>
      <div className=" max-w-[1536px] gap-6 sm:gap-3 md:gap-4 lg-gap-5 grid grid-cols-12 px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6 lg:py-8 mx-auto">
        <aside className="sticky top-[88px] self-start col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3 flex flex-col justify-start bg-primary/40 p-4 rounded-lg">
          {/*<h2 className="text-3xl font-semibold mb-4">All Products</h2>
          <p className="text-black/60 text-base">
            Explore our diverse range of stores offering a variety of products
            and services to cater to your needs.
          </p>
          */}
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold">Filtrar por categoría</h2>
            <div className="flex flex-col flex-wrap gap-2">
              {categoriesList.map((category) => (
                <button
                  key={category._id}
                  className="bg-primary/30 hover:bg-secondary/40 rounded-lg px-4 py-2"
                  onClick={() => filterByCategory(category._id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <h2 className="text-2xl font-semibold">Filtrar por oferta</h2>
            <div className="flex flex-col flex-wrap gap-2">
              <button
                className="bg-primary/30 hover:bg-secondary/40 rounded-lg px-4 py-2"
                onClick={() => filterByOffer(true)}
              >
                En oferta
              </button>
              <button
                className="bg-primary/30 hover:bg-secondary/40 rounded-lg px-4 py-2"
                onClick={() => filterByOffer(false)}
              >
                Sin oferta
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <h2 className="text-2xl font-semibold">
              Filtrar por rango de precio
            </h2>
            <div className="flex flex-col flex-wrap gap-2">
              <button
                className="bg-primary/30 hover:bg-secondary/40 rounded-lg px-4 py-2"
                onClick={() => filterByPrice(0, 70)}
              >
                Hasta 70€
              </button>
              <button
                className="bg-primary/30 hover:bg-secondary/40 rounded-lg px-4 py-2"
                onClick={() => filterByPrice(70, 120)}
              >
                Entre 70 y 120€
              </button>
              <button
                className="bg-primary/10 hover:bg-primary/20 rounded-lg px-4 py-2"
                onClick={() => filterByPrice(120, Infinity)}
              >
                Más de 120€
              </button>
            </div>
          </div>
        </aside>
        <div className="col-span-12 sm:col-span-6 md:col-span-8 lg:col-span-9 gap-6 sm:gap-3 md:gap-4 lg-gap-5 grid grid-cols-6 sm-grid-cols-12 md:grid-cols-8 lg:grid-cols-9">
          {productsList.map((product) => (
            <ListElement key={product._id} item={product} type="product" />
          ))}
        </div>
      </div>
      <Link to="/register">Register AAAA</Link>
    </>
  );
}
