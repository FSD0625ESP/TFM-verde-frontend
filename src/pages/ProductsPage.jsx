import { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import Slider from "../components/Slider/Slider";
import { Button, Spinner } from "@heroui/react";
import ListElement from "../components/ListElement/ListElement";
import {
  getAllFeaturedProducts,
  getAllCategories,
  searchProducts,
} from "../services/api";
import { addToast } from "@heroui/react";
import { Slider as PriceSlider } from "@heroui/react";

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
    fetchFeaturedProducts();
    fetchCategories();
    console.log("useEffect launched");
  }, []);

  useEffect(() => {
    if (!loaderRef.current) return;

    // Si acaban de aplicar filtros, no cargar más páginas hasta que el usuario haga scroll
    if (filtersApplied) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "200px" }
    );

    observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [hasMore, loadMore, filtersApplied]);

  const handleCategoryToggle = (category) => {
    setSelectedCategories(
      selectedCategories.includes(category)
        ? selectedCategories.filter((cat) => cat !== category)
        : [...selectedCategories, category]
    );
  };

  // Espera a que termine el scroll antes de continuar
  function waitForScroll(ref) {
    return new Promise((resolve) => {
      if (!ref.current) return resolve();
      let lastY = window.scrollY;
      let timeout;
      function check() {
        if (Math.abs(window.scrollY - lastY) < 2) {
          clearTimeout(timeout);
          window.removeEventListener("scroll", check);
          resolve();
        } else {
          lastY = window.scrollY;
          timeout = setTimeout(check, 50);
        }
      }
      window.addEventListener("scroll", check);
      check();
    });
  }

  const handleFilters = async () => {
    // iniciar un nuevo token de búsqueda para ignorar respuestas en vuelo
    searchTokenRef.current += 1;
    const token = searchTokenRef.current;

    // cancelar cualquier petición anterior y crear un nuevo AbortController
    if (controllerRef.current) controllerRef.current.abort();
    controllerRef.current = new AbortController();
    const signal = controllerRef.current.signal;

    // Resetear página e indicar carga mientras obtenemos la página 1
    setPage(1);
    setHasMore(false);
    setLoading(true);
    setFiltersApplied(true); // Evita que el observer cargue más páginas

    // Primero vaciar la lista de productos actual
    setProductsList([]);

    // Hacer scroll suave al inicio de la lista de productos
    if (productsContainerRef.current) {
      productsContainerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      await waitForScroll(productsContainerRef);
    }

    console.log("[Frontend] Aplicando nuevos filtros... token=", token);

    // Realizar la búsqueda con los nuevos filtros (página 1)
    searchProducts(1, "", selectedCategories, offer, min, max, signal)
      .then((data) => {
        // ignorar si empezó una búsqueda más nueva
        if (token !== searchTokenRef.current) {
          console.log(
            "Descartar resultado de filtros porque empezó una búsqueda nueva"
          );
          return;
        }

        console.log("[Frontend] Received", data.length, "products");

        // Establecer los nuevos resultados (máx 20)
        setProductsList(data);
        setPage(1);
        setHasMore(true);
        setLoading(false);
        setFiltersApplied(false); // Reactivar el observer para scroll infinito
      })
      .catch((error) => {
        addToast({
          type: "error",
          message: "Error en la búsqueda de productos",
          description: error,
        });
        setLoading(false);
        setFiltersApplied(false); // Reactivar el observer aunque haya error
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
        <aside className="sticky top-[98px] self-start col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-3 flex flex-col justify-start bg-primary/40 p-4 rounded-lg">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold">Filtrar por categoría</h2>
            <div className="flex flex-col flex-wrap gap-2">
              {categoriesList.map((category) => (
                <Button
                  key={category._id}
                  className={`bg-primary/30 hover:bg-secondary/40 rounded-lg px-4 py-2 ${
                    selectedCategories.includes(category._id)
                      ? "bg-secondary/60"
                      : ""
                  }`}
                  onPointerDown={(e) => {
                    e.preventDefault();
                    handleCategoryToggle(category._id);
                  }}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <h2 className="text-2xl font-semibold">Filtrar por oferta</h2>
            <div className="flex flex-col flex-wrap gap-2">
              <Button
                className={`bg-primary/30 hover:bg-secondary/40 rounded-lg px-4 py-2 ${
                  offer ? "bg-secondary/60" : ""
                }`}
                onPointerDown={() => setOffer(!offer)}
              >
                En Oferta
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <h2 className="text-2xl font-semibold">
              Filtrar por rango de precio
            </h2>
            <div className="flex flex-col flex-wrap gap-2">
              <PriceSlider
                className="max-w-md"
                defaultValue={[0, 500]}
                formatOptions={{ style: "currency", currency: "EUR" }}
                label="Precio"
                maxValue={500}
                minValue={0}
                step={10}
                onChange={(values) => {
                  //console.log(values);
                  setMin(values[0]);
                  setMax(values[1]);
                }}
              />
            </div>
            <div>
              <Button
                className="bg-primary/30 hover:bg-secondary/40 rounded-lg px-4 py-2"
                onClick={() => handleFilters()}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Aplicando...
                  </>
                ) : (
                  "Aplicar filtros"
                )}
              </Button>
            </div>
          </div>
        </aside>
        <div
          ref={productsContainerRef}
          id="products-list"
          className="col-span-12 sm:col-span-6 md:col-span-8 lg:col-span-9 gap-6 sm:gap-3 md:gap-4 lg-gap-5 grid grid-cols-6 sm-grid-cols-12 md:grid-cols-8 lg:grid-cols-9"
        >
          {productsList.map((product) => (
            <ListElement key={product._id} item={product} type="product" />
          ))}
          {loading && (
            <div className="col-span-full flex items-center justify-center gap-2 py-8">
              <Spinner size="lg" />
              <span className="text-lg">Cargando productos...</span>
            </div>
          )}
        </div>
        <div ref={loaderRef} className="col-span-full h-1"></div>
      </div>
    </>
  );
}
