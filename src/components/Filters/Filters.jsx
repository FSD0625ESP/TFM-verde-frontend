import { useEffect, useState, useRef, useCallback } from "react";
import {
  Tabs,
  Tab,
} from "@heroui/react";
import { useSearchParams } from "react-router-dom";
import { MapPin, Home } from "lucide-react";
import { searchProducts, searchStores } from "../../services/api";
import FiltersBar from "./FiltersBar";
import FiltersResults from "./FiltersResults";

/**
 * Componente Filtros universal
 * @param {Array} categoriesList - Lista de categorías
 * @param {Array} storesList - Lista de tiendas (opcional)
 * @param {String} mode - 'products' | 'stores' | 'both' (default: 'both')
 * @param {String} searchTerm - Término de búsqueda desde URL (opcional)
 * @param {Boolean} showTabs - Mostrar tabs o no (default: true)
 */
export default function Filters({
  categoriesList,
  storesList = [],
  mode = 'both',
  searchTerm = '',
  showTabs = true,
  initialMinPrice = 0,
  initialMaxPrice = 500
}) {
  // ============ ESTADO PRODUCTOS ============
  const [productsList, setProductsList] = useState([]);
  const [productsTotal, setProductsTotal] = useState(0); // Total real de resultados
  const [selectedProductCategories, setSelectedProductCategories] = useState([]);
  const [tempProductCategories, setTempProductCategories] = useState([]);

  // Initialize selectedStores with the single store if only one is provided
  const initialSelectedStores = storesList.length === 1 ? [storesList[0]._id] : [];
  const [selectedStores, setSelectedStores] = useState(initialSelectedStores);
  const [tempStores, setTempStores] = useState(initialSelectedStores);

  const [searchParams] = useSearchParams();
  const searchParam = searchParams.get("search") || "";

  const [searchStoreInputValue, setSearchStoreInputValue] = useState("");
  const [searchText, setSearchText] = useState(""); // Valor de búsqueda aplicado
  const [storesInputValue, setStoresInputValue] = useState("");
  const [categoriesInputValue, setCategoriesInputValue] = useState("");
  const [storeCategoriesInputValue, setStoreCategoriesInputValue] = useState("");
  const [productsPage, setProductsPage] = useState(1);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [initialLoadingProducts, setInitialLoadingProducts] = useState(true);
  const [offer, setOffer] = useState(false);
  const [tempOffer, setTempOffer] = useState(false);
  const [min, setMin] = useState(initialMinPrice);
  const [max, setMax] = useState(initialMaxPrice);
  const [tempMin, setTempMin] = useState(initialMinPrice);
  const [tempMax, setTempMax] = useState(initialMaxPrice);

  // ============ ESTADO TIENDAS ============
  const [storesResults, setStoresResults] = useState([]);
  const [storesTotal, setStoresTotal] = useState(0); // Total real de resultados
  const [selectedStoreCategories, setSelectedStoreCategories] = useState([]);
  const [tempStoreCategories, setTempStoreCategories] = useState([]);
  const [storesPage, setStoresPage] = useState(1);
  const [hasMoreStores, setHasMoreStores] = useState(true);
  const [loadingStores, setLoadingStores] = useState(false);
  const [initialLoadingStores, setInitialLoadingStores] = useState(true);

  // ============ REFERENCIAS ============
  const loaderProductsRef = useRef(null);
  const loaderStoresRef = useRef(null);
  const productsContainerRef = useRef(null);
  const storesContainerRef = useRef(null);
  const controllerProductsRef = useRef(null);
  const controllerStoresRef = useRef(null);
  const searchTokenProductsRef = useRef(0);
  const searchTokenStoresRef = useRef(0);
  const initialLoadProductsRef = useRef(false);
  const initialLoadStoresRef = useRef(false);

  // ============ ESTADO UI ============
  const [activeTab, setActiveTab] = useState("products");
  const [productsFiltersApplied, setProductsFiltersApplied] = useState(false);
  const [storesFiltersApplied, setStoresFiltersApplied] = useState(false);

  // ============ EFECTO - SINCRONIZAR SEARCH PARAM CON ESTADO ============
  useEffect(() => {
    setSearchStoreInputValue(searchParam);
    setSearchText(searchParam);
  }, [searchParam]);

  // ============ FUNCIONES - PRODUCTOS ============
  const loadMoreProducts = useCallback(async () => {
    if (loadingProducts || !hasMoreProducts) return;
    setLoadingProducts(true);
    const token = searchTokenProductsRef.current;

    if (controllerProductsRef.current) {
      controllerProductsRef.current.abort();
    }
    controllerProductsRef.current = new AbortController();
    const signal = controllerProductsRef.current.signal;

    try {
      const response = await searchProducts(
        productsPage,
        searchText,
        selectedProductCategories,
        selectedStores,
        offer,
        min,
        max,
        signal
      );

      if (token !== searchTokenProductsRef.current) return;

      const results = response.products || response; // Manejo tanto estructura nueva como antigua
      const total = response.total !== undefined ? response.total : productsList.length; // Usar total del backend

      if (results.length === 0) {
        setHasMoreProducts(false);
      } else {
        setProductsList((prev) => {
          const existingIds = new Set(prev.map((p) => String(p._id)));
          const filtered = results.filter((p) => !existingIds.has(String(p._id)));
          return [...prev, ...filtered];
        });
        setProductsPage((prev) => prev + 1);
      }
      setProductsTotal(total);
    } catch (err) {
      console.error("Error buscando productos:", err);
    } finally {
      setLoadingProducts(false);
    }
  }, [loadingProducts, hasMoreProducts, productsPage, selectedProductCategories, selectedStores, offer, min, max, searchText]);

  const loadInitialProducts = useCallback(async () => {
    setInitialLoadingProducts(true);
    searchTokenProductsRef.current += 1;
    const token = searchTokenProductsRef.current;

    if (controllerProductsRef.current) controllerProductsRef.current.abort();
    controllerProductsRef.current = new AbortController();
    const signal = controllerProductsRef.current.signal;

    try {
      // SIEMPRE usar searchProducts con paginación
      const response = await searchProducts(
        1,
        searchText,
        selectedProductCategories,
        selectedStores,
        offer,
        min,
        max,
        signal
      );

      if (token !== searchTokenProductsRef.current) return;

      const data = response.products || response; // Manejo tanto estructura nueva como antigua
      const total = response.total !== undefined ? response.total : data.length; // Usar total del backend

      if (data.length === 20) {
        setHasMoreProducts(true);
        setProductsPage(2);
      } else {
        setHasMoreProducts(false);
        setProductsPage(1);
      }
      setProductsList(data);
      setProductsTotal(total);
    } catch (err) {
      console.error("Error cargando productos iniciales:", err);
    } finally {
      setInitialLoadingProducts(false);
    }
  }, [selectedProductCategories, selectedStores, offer, min, max, searchText]);

  // ============ FUNCIONES - TIENDAS ============
  const loadMoreStores = useCallback(async () => {
    if (loadingStores || !hasMoreStores) return;
    setLoadingStores(true);
    const token = searchTokenStoresRef.current;

    if (controllerStoresRef.current) {
      controllerStoresRef.current.abort();
    }
    controllerStoresRef.current = new AbortController();
    const signal = controllerStoresRef.current.signal;

    try {
      const response = await searchStores(
        storesPage,
        searchText,
        selectedStoreCategories,
        0,
        5,
        signal
      );

      if (token !== searchTokenStoresRef.current) return;

      const results = response.stores || response; // Manejo tanto estructura nueva como antigua
      const total = response.total !== undefined ? response.total : storesResults.length; // Usar total del backend

      if (results.length === 0) {
        setHasMoreStores(false);
      } else {
        setStoresResults((prev) => {
          const existingIds = new Set(prev.map((s) => String(s._id)));
          const filtered = results.filter((s) => !existingIds.has(String(s._id)));
          return [...prev, ...filtered];
        });
        setStoresPage((prev) => prev + 1);
      }
      setStoresTotal(total);
    } catch (err) {
      console.error("Error buscando tiendas:", err);
    } finally {
      setLoadingStores(false);
    }
  }, [loadingStores, hasMoreStores, storesPage, selectedStoreCategories, searchText]);

  const loadInitialStores = useCallback(async () => {
    setInitialLoadingStores(true);
    searchTokenStoresRef.current += 1;
    const token = searchTokenStoresRef.current;

    if (controllerStoresRef.current) controllerStoresRef.current.abort();
    controllerStoresRef.current = new AbortController();
    const signal = controllerStoresRef.current.signal;

    try {
      // SIEMPRE usar searchStores con paginación
      const response = await searchStores(
        1,
        searchText,
        selectedStoreCategories,
        0,
        5,
        signal
      );

      if (token !== searchTokenStoresRef.current) return;

      const data = response.stores || response; // Manejo tanto estructura nueva como antigua
      const total = response.total !== undefined ? response.total : data.length; // Usar total del backend

      if (data.length === 20) {
        setHasMoreStores(true);
        setStoresPage(2);
      } else {
        setHasMoreStores(false);
        setStoresPage(1);
      }
      setStoresResults(data);
      setStoresTotal(total);
    } catch (err) {
      console.error("Error cargando tiendas iniciales:", err);
    } finally {
      setInitialLoadingStores(false);
    }
  }, [selectedStoreCategories, searchStoreInputValue]);

  // ============ EFECTOS - SCROLL INFINITO ============
  useEffect(() => {
    if (!loaderProductsRef.current) return;
    if (productsFiltersApplied) return; // Pausa el observer mientras se aplican filtros

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMoreProducts();
      },
      { rootMargin: "200px" }
    );

    observer.observe(loaderProductsRef.current);
    return () => observer.disconnect();
  }, [hasMoreProducts, loadMoreProducts, productsFiltersApplied]);

  useEffect(() => {
    if (!loaderStoresRef.current) return;
    if (storesFiltersApplied) return; // Pausa el observer mientras se aplican filtros

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMoreStores();
      },
      { rootMargin: "200px" }
    );

    observer.observe(loaderStoresRef.current);
    return () => observer.disconnect();
  }, [hasMoreStores, loadMoreStores, storesFiltersApplied]);

  // ============ EFECTOS - RESET CUANDO CAMBIAN FILTROS ============
  useEffect(() => {
    searchTokenProductsRef.current += 1;
    if (controllerProductsRef.current) controllerProductsRef.current.abort();
    setProductsList([]);
    setProductsTotal(0);
    setProductsPage(1);
    setHasMoreProducts(true);
    initialLoadProductsRef.current = false;
  }, [searchText, selectedProductCategories, selectedStores, offer, min, max]);

  // Cuando se resetean los filtros, recargar productos iniciales automáticamente
  useEffect(() => {
    if ((mode === 'products' || mode === 'both') && !initialLoadProductsRef.current) {
      initialLoadProductsRef.current = true;
      loadInitialProducts();
    }
  }, [loadInitialProducts, mode]);

  useEffect(() => {
    searchTokenStoresRef.current += 1;
    if (controllerStoresRef.current) controllerStoresRef.current.abort();
    setStoresResults([]);
    setStoresTotal(0);
    setStoresPage(1);
    setHasMoreStores(true);
    initialLoadStoresRef.current = false;
  }, [searchText, selectedStoreCategories]);

  // Cuando se resetean los filtros de tiendas, recargar tiendas iniciales automáticamente
  useEffect(() => {
    if ((mode === 'stores' || mode === 'both') && !initialLoadStoresRef.current) {
      initialLoadStoresRef.current = true;
      loadInitialStores();
    }
  }, [loadInitialStores, mode]);

  // ============ HANDLERS FILTROS PRODUCTOS ============
  const handleOfferChange = () => {
    setTempOffer(!tempOffer);
  };

  const handlePriceChange = (values) => {
    setTempMin(values[0]);
    setTempMax(values[1]);
  };

  const applyProductFilters = async () => {
    setProductsFiltersApplied(true); // Pausa el scroll
    searchTokenProductsRef.current += 1;
    if (controllerProductsRef.current) controllerProductsRef.current.abort();

    setProductsList([]);
    setProductsPage(1);
    setHasMoreProducts(true);

    setSelectedProductCategories(tempProductCategories);
    setSelectedStores(tempStores);
    setOffer(tempOffer);
    setMin(tempMin);
    setMax(tempMax);
    setSearchText(searchStoreInputValue); // Aplica el valor del input como texto de búsqueda

    // Carga la primera página con los nuevos filtros
    setInitialLoadingProducts(true);
    const token = searchTokenProductsRef.current;

    if (controllerProductsRef.current) controllerProductsRef.current.abort();
    controllerProductsRef.current = new AbortController();
    const signal = controllerProductsRef.current.signal;

    try {
      const response = await searchProducts(
        1,
        searchStoreInputValue,
        tempProductCategories,
        tempStores,
        tempOffer,
        tempMin,
        tempMax,
        signal
      );

      if (token !== searchTokenProductsRef.current) return;

      const results = response.products || response; // Manejo tanto estructura nueva como antigua
      if (results.length === 20) {
        setHasMoreProducts(true);
        setProductsPage(2);
      } else {
        setHasMoreProducts(false);
      }
      setProductsList(results);
    } catch (err) {
      console.error("Error cargando productos iniciales:", err);
    } finally {
      setInitialLoadingProducts(false);
      // Reanuda el scroll después de cargar los resultados iniciales
      setTimeout(() => {
        setProductsFiltersApplied(false);
      }, 0);
    }
  };

  // ============ HANDLERS FILTROS TIENDAS ============

  const applyStoreFilters = async () => {
    setStoresFiltersApplied(true); // Pausa el scroll
    searchTokenStoresRef.current += 1;
    if (controllerStoresRef.current) controllerStoresRef.current.abort();

    setStoresResults([]);
    setStoresPage(1);
    setHasMoreStores(true);

    setSelectedStoreCategories(tempStoreCategories);
    setSearchText(searchStoreInputValue); // Aplica el valor del input como texto de búsqueda

    // Carga la primera página con los nuevos filtros
    setInitialLoadingStores(true);
    const token = searchTokenStoresRef.current;

    if (controllerStoresRef.current) controllerStoresRef.current.abort();
    controllerStoresRef.current = new AbortController();
    const signal = controllerStoresRef.current.signal;

    try {
      const response = await searchStores(
        1,
        searchStoreInputValue,
        tempStoreCategories,
        0,
        5,
        signal
      );

      if (token !== searchTokenStoresRef.current) return;

      const results = response.stores || response; // Manejo tanto estructura nueva como antigua
      if (results.length === 20) {
        setHasMoreStores(true);
        setStoresPage(2);
      } else {
        setHasMoreStores(false);
      }
      setStoresResults(results);
    } catch (err) {
      console.error("Error cargando tiendas iniciales:", err);
    } finally {
      setInitialLoadingStores(false);
      // Reanuda el scroll después de cargar los resultados iniciales
      setTimeout(() => {
        setStoresFiltersApplied(false);
      }, 0);
    }
  };

  // ============ RENDER PRINCIPAL ============
  if (showTabs) {
    // Modo con TABS (ResultsPage)
    return (
      <div className="container mx-auto px-4 md:px-8 py-8">
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
          {(mode === 'products' || mode === 'both') && (
            <Tab
              key="products"
              title={
                <div className="flex items-center gap-2">
                  <Home size={18} />
                  <span>Productos ({productsTotal})</span>
                </div>
              }
            >
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 py-6">
                <div className="lg:col-span-1">
                  <FiltersBar
                    mode="products"
                    storesList={storesList}
                    categoriesList={categoriesList}
                    tempStores={tempStores}
                    setTempStores={setTempStores}
                    searchStoreInputValue={searchStoreInputValue}
                    setSearchStoreInputValue={setSearchStoreInputValue}
                    storesInputValue={storesInputValue}
                    setStoresInputValue={setStoresInputValue}
                    tempProductCategories={tempProductCategories}
                    setTempProductCategories={setTempProductCategories}
                    categoriesInputValue={categoriesInputValue}
                    setCategoriesInputValue={setCategoriesInputValue}
                    tempMin={tempMin}
                    tempMax={tempMax}
                    handlePriceChange={handlePriceChange}
                    tempOffer={tempOffer}
                    handleOfferChange={handleOfferChange}
                    loadingProducts={loadingProducts}
                    applyProductFilters={applyProductFilters}
                    minPrice={initialMinPrice}
                    maxPrice={initialMaxPrice}
                  />
                </div>
                <FiltersResults
                  type="product"
                  items={productsList}
                  loading={loadingProducts}
                  initialLoading={initialLoadingProducts}
                  hasMore={hasMoreProducts}
                  loaderRef={loaderProductsRef}
                  containerRef={productsContainerRef}
                />
              </div>
            </Tab>
          )}

          {(mode === 'stores' || mode === 'both') && (
            <Tab
              key="stores"
              title={
                <div className="flex items-center gap-2">
                  <MapPin size={18} />
                  <span>Tiendas ({storesTotal})</span>
                </div>
              }
            >
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 py-6">
                <div className="lg:col-span-1">
                  <FiltersBar
                    mode="stores"
                    categoriesList={categoriesList}
                    tempStoreCategories={tempStoreCategories}
                    setTempStoreCategories={setTempStoreCategories}
                    storeCategoriesInputValue={storeCategoriesInputValue}
                    setStoreCategoriesInputValue={setStoreCategoriesInputValue}
                    loadingStores={loadingStores}
                    applyStoreFilters={applyStoreFilters}
                    searchStoreInputValue={searchStoreInputValue}
                    setSearchStoreInputValue={setSearchStoreInputValue}
                  />
                </div>
                <FiltersResults
                  type="store"
                  items={storesResults}
                  loading={loadingStores}
                  initialLoading={initialLoadingStores}
                  hasMore={hasMoreStores}
                  loaderRef={loaderStoresRef}
                  containerRef={storesContainerRef}
                />
              </div>
            </Tab>
          )}
        </Tabs>
      </div>
    );
  } else {
    // Modo SIN TABS (ProductsPage o StoresPage)
    if (mode === 'products') {
      return (
        <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6 lg:py-8 w-full">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-5 container mx-auto">
            <div className="md:col-span-2 lg:col-span-1">
              <FiltersBar
                mode="products"
                storesList={storesList}
                categoriesList={categoriesList}
                tempStores={tempStores}
                setTempStores={setTempStores}
                storesInputValue={storesInputValue}
                setStoresInputValue={setStoresInputValue}
                tempProductCategories={tempProductCategories}
                setTempProductCategories={setTempProductCategories}
                categoriesInputValue={categoriesInputValue}
                setCategoriesInputValue={setCategoriesInputValue}
                tempMin={tempMin}
                tempMax={tempMax}
                handlePriceChange={handlePriceChange}
                tempOffer={tempOffer}
                handleOfferChange={handleOfferChange}
                loadingProducts={loadingProducts}
                applyProductFilters={applyProductFilters}
                minPrice={initialMinPrice}
                maxPrice={initialMaxPrice}
                searchStoreInputValue={searchStoreInputValue}
                setSearchStoreInputValue={setSearchStoreInputValue}
              />
            </div>
            <div className="md:col-span-3 lg:col-span-4">
              <FiltersResults
                type="product"
                items={productsList}
                loading={loadingProducts}
                initialLoading={initialLoadingProducts}
                hasMore={hasMoreProducts}
                loaderRef={loaderProductsRef}
                containerRef={productsContainerRef}
              />
            </div>
          </div>
        </div>
      );
    } else if (mode === 'stores') {
      return (
        <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6 lg:py-8 w-full">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-5 container mx-auto">
            <div className="md:col-span-2 lg:col-span-1">
              <FiltersBar
                mode="stores"
                categoriesList={categoriesList}
                tempStoreCategories={tempStoreCategories}
                setTempStoreCategories={setTempStoreCategories}
                storeCategoriesInputValue={storeCategoriesInputValue}
                setStoreCategoriesInputValue={setStoreCategoriesInputValue}
                loadingStores={loadingStores}
                applyStoreFilters={applyStoreFilters}
                searchStoreInputValue={searchStoreInputValue}
                setSearchStoreInputValue={setSearchStoreInputValue}
              />
            </div>
            <div className="md:col-span-3 lg:col-span-4">
              <FiltersResults
                type="store"
                items={storesResults}
                loading={loadingStores}
                initialLoading={initialLoadingStores}
                hasMore={hasMoreStores}
                loaderRef={loaderStoresRef}
                containerRef={storesContainerRef}
              />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <></>
      );
    }
  }
}
