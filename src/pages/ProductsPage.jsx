import { useEffect, useState } from "react";
import Slider from "../components/Slider/Slider";
import {
  getAllFeaturedProducts,
  getAllStores,
  getAllCategories,
} from "../services/api";
import { addToast } from "@heroui/react";
import { Slider as PriceSlider } from "@heroui/react";
import { useCart } from "../contexts/CartContext.jsx";

export default function ProductsPage() {
  const [productsList, setProductsList] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const loaderRef = useRef(null);
  const productsContainerRef = useRef(null);
  const [page, setPage] = useState(1);
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offer, setOffer] = useState(false);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(500);

  // referencia al AbortController actual para cancelar peticiones en vuelo
  const controllerRef = useRef(null);
  // token para ignorar respuestas antiguas cuando cambian los filtros
  const searchTokenRef = useRef(0);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    console.log("Loading more products, page:", page);
    const token = searchTokenRef.current;
    // crear un AbortController para esta petición y reemplazar el anterior
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    controllerRef.current = new AbortController();
    const signal = controllerRef.current.signal;
    try {
      const data = await searchProducts(
        page,
        "", // texto
        selectedCategories,
        offer,
        min,
        max,
        signal
      );
      // ignorar resultados de búsquedas anteriores si cambió el token
      if (token !== searchTokenRef.current) {
        console.log(
          "Descartar resultado de loadMore porque cambiaron los filtros"
        );
        return;
      }

      if (data.length === 0) {
        setHasMore(false);
      } else {
        // añadir solo los items que no estén ya presentes para evitar duplicados
        setProductsList((prev) => {
          const existingIds = new Set(prev.map((p) => String(p._id)));
          const filtered = data.filter((p) => !existingIds.has(String(p._id)));
          return [...prev, ...filtered];
        });
        setPage((prev) => prev + 1);
      }
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, selectedCategories, offer, min, max]);

import Filtros from "../components/Filtros/Filtros";

export default function ProductsPage() {
  const [featuredProductsList, setFeaturedProductsList] = useState([]);
  const fetchFeaturedProducts = async () => {
    try {
      const data = await getAllFeaturedProducts();
      setFeaturedProductsList(data);
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
    console.log("useEffect launched");
  }, []);

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

      {categoriesList.length > 0 && storesList.length > 0 && (
        <Filtros categoriesList={categoriesList} storesList={storesList} />
      )}
    </>
  );
}
