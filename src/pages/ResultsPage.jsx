import { useState, useEffect, useRef, useCallback } from "react";
import {
  Card,
  CardBody,
  Tabs,
  Tab,
  Spinner,
  CheckboxGroup,
  Checkbox,
  Slider,
  Button
} from "@heroui/react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { searchProducts, searchStores, getAllCategories } from "../services/api";
import { MapPin, Home } from "lucide-react";
import ListElement from "../components/ListElement/ListElement";

export default function ResultadosPage() {
  const [params] = useSearchParams();
  const searchFromURL = params.get("search") || "";
  const navigate = useNavigate();

  // Estado general
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingStores, setLoadingStores] = useState(false);
  const [activeTab, setActiveTab] = useState("products");

  // Scroll infinito productos
  const [productsPage, setProductsPage] = useState(1);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const loaderProductsRef = useRef(null);
  const productsContainerRef = useRef(null);
  const controllerProductsRef = useRef(null);
  const searchTokenProductsRef = useRef(0);

  // Scroll infinito tiendas
  const [storesPage, setStoresPage] = useState(1);
  const [hasMoreStores, setHasMoreStores] = useState(true);
  const loaderStoresRef = useRef(null);
  const storesContainerRef = useRef(null);
  const controllerStoresRef = useRef(null);
  const searchTokenStoresRef = useRef(0);

  // Filtros productos - TEMPORALES (mientras se ajustan)
  const [tempProductCategories, setTempProductCategories] = useState([]);
  const [tempPriceRange, setTempPriceRange] = useState([0, 1000]);

  // Filtros productos - ACTIVOS (los que se usan en la búsqueda)
  const [productCategories, setProductCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);

  // Filtros tiendas - TEMPORALES (mientras se ajustan)
  const [tempStoreCategories, setTempStoreCategories] = useState([]);

  // Filtros tiendas - ACTIVOS (los que se usan en la búsqueda)
  const [storeCategories, setStoreCategories] = useState([]);

  // Cargar categorías
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (err) {
        console.error("Error cargando categorías:", err);
      }
    };
    loadCategories();
  }, []);

  // Sincronizar filtros temporales con filtros activos
  useEffect(() => {
    setTempProductCategories(productCategories);
    setTempPriceRange(priceRange);
  }, [productCategories, priceRange]);

  // Sincronizar filtros de tiendas
  useEffect(() => {
    setTempStoreCategories(storeCategories);
  }, [storeCategories]);

  // Cargar más productos
  const loadMoreProducts = useCallback(async () => {
    if (loadingProducts || !hasMoreProducts || !searchFromURL) {
      return;
    }
    setLoadingProducts(true);
    const token = searchTokenProductsRef.current;

    if (controllerProductsRef.current) {
      controllerProductsRef.current.abort();
    }
    controllerProductsRef.current = new AbortController();
    const signal = controllerProductsRef.current.signal;

    try {
      const results = await searchProducts(
        productsPage,
        searchFromURL,
        productCategories,
        false,
        priceRange[0],
        priceRange[1],
        signal
      );

      if (token !== searchTokenProductsRef.current) {
        return;
      }
      if (results.length === 0) {
        setHasMoreProducts(false);
      } else {
        setProducts((prev) => {
          const existingIds = new Set(prev.map((p) => String(p._id)));
          const filtered = results.filter((p) => !existingIds.has(String(p._id)));
          return [...prev, ...filtered];
        });
        setProductsPage((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Error buscando productos:", err);
    } finally {
      setLoadingProducts(false);
    }
  }, [loadingProducts, hasMoreProducts, productsPage, productCategories, priceRange, searchFromURL]);

  // Cargar más tiendas
  const loadMoreStores = useCallback(async () => {
    if (loadingStores || !hasMoreStores || !searchFromURL) return;
    setLoadingStores(true);
    console.log("Loading more stores, page:", storesPage);

    const token = searchTokenStoresRef.current;

    if (controllerStoresRef.current) {
      controllerStoresRef.current.abort();
    }
    controllerStoresRef.current = new AbortController();
    const signal = controllerStoresRef.current.signal;

    try {
      const results = await searchStores(
        storesPage,
        searchFromURL,
        storeCategories,
        0,
        5,
        signal
      );

      if (token !== searchTokenStoresRef.current) {
        console.log("Descartar resultado de loadMoreStores porque cambió el token");
        return;
      }

      if (results.length === 0) {
        setHasMoreStores(false);
      } else {
        setStores((prev) => {
          const existingIds = new Set(prev.map((p) => String(p._id)));
          const filtered = results.filter((p) => !existingIds.has(String(p._id)));
          return [...prev, ...filtered];
        });
        setStoresPage((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Error buscando tiendas:", err);
    } finally {
      setLoadingStores(false);
    }
  }, [loadingStores, hasMoreStores, storesPage, storeCategories, searchFromURL]);

  // Intersection Observer para scroll infinito de productos
  useEffect(() => {
    if (!loaderProductsRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMoreProducts();
      },
      { rootMargin: "200px" }
    );

    observer.observe(loaderProductsRef.current);

    return () => observer.disconnect();
  }, [hasMoreProducts, loadMoreProducts]);

  // Intersection Observer para scroll infinito de tiendas
  useEffect(() => {
    if (!loaderStoresRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMoreStores();
      },
      { rootMargin: "200px" }
    );

    observer.observe(loaderStoresRef.current);

    return () => observer.disconnect();
  }, [hasMoreStores, loadMoreStores]);

  // Refs para controlar la carga inicial (uno para cada pestaña)
  const initialLoadProductsRef = useRef(false);
  const initialLoadStoresRef = useRef(false);

  // Cuando cambian filtros de productos, resetear y cargar primera página
  useEffect(() => {
    if (!searchFromURL) return;

    searchTokenProductsRef.current += 1;
    if (controllerProductsRef.current) controllerProductsRef.current.abort();

    setProducts([]);
    setProductsPage(1);
    setHasMoreProducts(true);
    initialLoadProductsRef.current = false;
  }, [searchFromURL, productCategories, priceRange]);

  // Cargar productos cuando se resetean
  useEffect(() => {
    if (searchFromURL && !initialLoadProductsRef.current && products.length === 0 && !loadingProducts) {
      console.log("[Frontend] Iniciando carga de productos");
      initialLoadProductsRef.current = true;
      loadMoreProducts();
    }
  }, [searchFromURL, products.length, loadingProducts, loadMoreProducts]);

  // Cuando cambian filtros de tiendas, resetear y cargar primera página
  useEffect(() => {
    if (!searchFromURL) return;

    searchTokenStoresRef.current += 1;
    if (controllerStoresRef.current) controllerStoresRef.current.abort();

    setStores([]);
    setStoresPage(1);
    setHasMoreStores(true);
    initialLoadStoresRef.current = false;
  }, [searchFromURL, storeCategories]);

  // Cargar tiendas cuando se resetean
  useEffect(() => {
    if (searchFromURL && !initialLoadStoresRef.current && stores.length === 0 && !loadingStores) {
      console.log("[Frontend] Iniciando carga de tiendas");
      initialLoadStoresRef.current = true;
      loadMoreStores();
    }
  }, [searchFromURL, stores.length, loadingStores, loadMoreStores]);

  const handleProductCategoryChange = (e) => {
    setTempProductCategories(e.toString().split(",").filter(Boolean));
  };

  const handleStoreCategoryChange = (e) => {
    setTempStoreCategories(e.toString().split(",").filter(Boolean));
  };

  const handlePriceChange = (e) => {
    setTempPriceRange(e);
  };

  // Aplicar filtros de productos
  const applyProductFilters = () => {
    setProductCategories(tempProductCategories);
    setPriceRange(tempPriceRange);
  };

  // Aplicar filtros de tiendas
  const applyStoreFilters = () => {
    setStoreCategories(tempStoreCategories);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 md:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Resultados de búsqueda</h1>
          <p className="text-white/90 text-lg">
            Mostrando resultados para: <span className="font-semibold">"{searchFromURL}"</span>
          </p>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <Tabs
          aria-label="Filtros"
          selectedKey={activeTab}
          onSelectionChange={setActiveTab}
          color="primary"
          variant="bordered"
          classNames={{
            tabList: "bg-white shadow-sm",
          }}
        >
          {/* TAB: PRODUCTOS */}
          <Tab
            key="products"
            title={
              <div className="flex items-center gap-2">
                <Home size={18} />
                <span>Productos ({products.length})</span>
              </div>
            }
          >
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 py-6">
              {/* Panel de Filtros */}
              <div className="lg:col-span-1">
                <Card className="shadow-sm border-1 border-gray-200 sticky top-24">
                  <CardBody className="p-4 space-y-6">
                    <div>
                      <h3 className="font-bold text-lg mb-3 text-gray-800">Filtros</h3>
                    </div>

                    {/* Filtro: Categorías */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">
                        Categorías
                      </label>
                      <CheckboxGroup
                        value={tempProductCategories}
                        onChange={handleProductCategoryChange}
                        color="primary"
                        size="sm"
                      >
                        {categories.map((cat) => (
                          <Checkbox key={cat._id} value={cat._id}>
                            {cat.name}
                          </Checkbox>
                        ))}
                      </CheckboxGroup>
                    </div>

                    {/* Filtro: Precio */}
                    <div className="space-y-3 border-t pt-4">
                      <label className="text-sm font-semibold text-gray-700">
                        Rango de Precio
                      </label>
                      <div className="px-2">
                        <Slider
                          label="Precio"
                          step={10}
                          maxValue={1000}
                          minValue={0}
                          value={tempPriceRange}
                          onChange={handlePriceChange}
                          className="max-w-md"
                          color="primary"
                        />
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>€{tempPriceRange[0]}</span>
                        <span>€{tempPriceRange[1]}</span>
                      </div>
                    </div>

                    {/* Botón aplicar filtros */}
                    <Button
                      fullWidth
                      color="primary"
                      className="bg-primary mt-4 text-white"
                      onClick={applyProductFilters}
                    >
                      Aplicar Filtros
                    </Button>
                  </CardBody>
                </Card>
              </div>

              {/* Lista de Productos */}
              <div ref={productsContainerRef} className="lg:col-span-3">
                {products.length === 0 && !loadingProducts ? (
                  <Card className="shadow-sm border-1 border-gray-200">
                    <CardBody className="p-8 text-center">
                      <p className="text-gray-500 text-lg">
                        No se encontraron productos
                      </p>
                      <p className="text-gray-400 text-sm mt-2">
                        Intenta con otras palabras clave o filtros
                      </p>
                    </CardBody>
                  </Card>
                ) : (
                  <>
                    <div className="grid gap-6 sm:gap-3 md:gap-4 lg-gap-5 grid-cols-6 sm-grid-cols-12 md:grid-cols-8 lg:grid-cols-9">
                      {products.map((product) => (
                        <ListElement
                          key={product._id}
                          item={product}
                          type="product"
                        />
                      ))}
                    </div>

                    {/* Loader para scroll infinito */}
                    {loadingProducts && (
                      <div className="col-span-full flex items-center justify-center gap-2 py-8">
                        <Spinner size="lg" />
                        <span className="text-lg">Cargando productos...</span>
                      </div>
                    )}

                    {/* Mensaje cuando no hay más resultados */}
                    {!loadingProducts && !hasMoreProducts && products.length > 0 && (
                      <div className="col-span-full flex items-center justify-center py-8">
                        <p className="text-gray-500 text-center">
                          No hay más resultados
                        </p>
                      </div>
                    )}

                    <div ref={loaderProductsRef} className="h-1" />
                  </>
                )}
              </div>
            </div>
          </Tab>

          {/* TAB: TIENDAS */}
          <Tab
            key="stores"
            title={
              <div className="flex items-center gap-2">
                <MapPin size={18} />
                <span>Tiendas ({stores.length})</span>
              </div>
            }
          >
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 py-6">
              {/* Panel de Filtros */}
              <div className="lg:col-span-1">
                <Card className="shadow-sm border-1 border-gray-200 sticky top-24">
                  <CardBody className="p-4 space-y-6">
                    <div>
                      <h3 className="font-bold text-lg mb-3 text-gray-800">Filtros</h3>
                    </div>

                    {/* Filtro: Categorías */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">
                        Categorías
                      </label>
                      <CheckboxGroup
                        value={tempStoreCategories}
                        onChange={handleStoreCategoryChange}
                        color="primary"
                        size="sm"
                      >
                        {categories.map((cat) => (
                          <Checkbox key={cat._id} value={cat._id}>
                            {cat.name}
                          </Checkbox>
                        ))}
                      </CheckboxGroup>
                    </div>

                    {/* Botón aplicar filtros */}
                    <Button
                      fullWidth
                      color="primary"
                      className="bg-primary mt-4 text-white"
                      onClick={applyStoreFilters}
                    >
                      Aplicar Filtros
                    </Button>
                  </CardBody>
                </Card>
              </div>

              {/* Lista de Tiendas */}
              <div ref={storesContainerRef} className="lg:col-span-3">
                {stores.length === 0 && !loadingStores ? (
                  <Card className="shadow-sm border-1 border-gray-200">
                    <CardBody className="p-8 text-center">
                      <p className="text-gray-500 text-lg">
                        No se encontraron tiendas
                      </p>
                      <p className="text-gray-400 text-sm mt-2">
                        Intenta con otras palabras clave o filtros
                      </p>
                    </CardBody>
                  </Card>
                ) : (
                  <>
                    <div className="grid gap-6 sm:gap-3 md:gap-4 lg-gap-5 grid-cols-6 sm-grid-cols-12 md:grid-cols-8 lg:grid-cols-9">
                      {stores.map((store) => (
                        <ListElement
                          key={store._id}
                          item={store}
                          type="store"
                        />
                      ))}
                    </div>

                    {/* Loader para scroll infinito */}
                    {loadingStores && (
                      <div className="col-span-full flex items-center justify-center gap-2 py-8">
                        <Spinner size="lg" />
                        <span className="text-lg">Cargando tiendas...</span>
                      </div>
                    )}

                    {/* Mensaje cuando no hay más resultados */}
                    {!loadingStores && !hasMoreStores && stores.length > 0 && (
                      <div className="col-span-full flex items-center justify-center py-8">
                        <p className="text-gray-500 text-center">
                          No hay más resultados
                        </p>
                      </div>
                    )}

                    <div ref={loaderStoresRef} className="h-1" />
                  </>
                )}
              </div>
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
