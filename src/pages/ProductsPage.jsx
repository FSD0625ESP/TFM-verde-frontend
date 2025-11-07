import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Slider from "../components/Slider/Slider";
import ListElement from "../components/ListElement/ListElement";
import {
  getAllFeaturedProducts,
  getAllCategories,
  searchProduct
} from "../services/api";
import { addToast } from "@heroui/react";
import { Slider as PriceSlider } from "@heroui/react";


export default function ProductsPage() {
  const [productsList, setProductsList] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const loaderRef = useRef(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offer, setOffer] = useState(false);
  // const [priceRange, setPriceRange] = useState([0, 1000]);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(1000);

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    console.log("Loading more products...");
    try {
      const data = await searchProduct(page, "", selectedCategories, offer); // <-- la API debe aceptar page
      if (data.length === 0) {
        setHasMore(false);
        return;
      }
      setProductsList(prev => [...prev, ...data]);
      setPage(prev => prev + 1);
    } finally {
      setLoading(false);
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
    // fetchProducts();
    fetchFeaturedProducts();
    fetchCategories();
    console.log("useEffect launched");
  }, []);

  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "200px" }
    );

    observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [loaderRef.current, hasMore]);


  const handleCategoryToggle = (category) => {
    setSelectedCategories(
      selectedCategories.includes(category)
        ? selectedCategories.filter(cat => cat !== category)
        : [...selectedCategories, category]
    );
  };


  const handleFilters = () => {
    setPage(1);
    searchProduct(selectedCategories, offer, min, max).then((data) => {
      setProductsList(data);
    }).catch((error) => {
      addToast({
        type: "error",
        message: "Error en la busqueda de productos",
        description: error
      })
    });
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
                  className={`bg-primary/30 hover:bg-secondary/40 rounded-lg px-4 py-2 ${selectedCategories.includes(category._id) ? 'bg-secondary/60' : ''}`}
                  onClick={() => handleCategoryToggle(category._id)}
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
                className={`bg-primary/30 hover:bg-secondary/40 rounded-lg px-4 py-2 ${offer ? 'bg-secondary/60' : ''}`}
                onClick={() => setOffer(!offer)}
              >
                Ofertas
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <h2 className="text-2xl font-semibold">
              Filtrar por rango de precio
            </h2>
            <div className="flex flex-col flex-wrap gap-2">
              <PriceSlider
                className="max-w-md"
                defaultValue={[100, 500]}
                formatOptions={{ style: "currency", currency: "EUR" }}
                label=""
                maxValue={1000}
                minValue={0}
                step={50}
                onChange={(values) => {
                  console.log(values);
                  setMin(values[0]);
                  setMax(values[1]);
                }}
              />
            </div>
            <div>
              <button
                className="bg-primary/30 hover:bg-secondary/40 rounded-lg px-4 py-2"
                onClick={() => handleFilters()}
              >
                Aplicar filtros
              </button>
            </div>
          </div>
        </aside>
        <div className="col-span-12 sm:col-span-6 md:col-span-8 lg:col-span-9 gap-6 sm:gap-3 md:gap-4 lg-gap-5 grid grid-cols-6 sm-grid-cols-12 md:grid-cols-8 lg:grid-cols-9" >
          {productsList.map((product) => (
            <ListElement key={product._id} item={product} type="product" />
          ))}
        </div>
        <div ref={loaderRef} className="col-span-full h-1"></div>
      </div>
    </>
  );
}
