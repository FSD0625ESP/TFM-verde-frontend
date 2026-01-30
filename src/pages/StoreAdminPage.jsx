import { useEffect, useState, useContext } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { Button, Image } from "@heroui/react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Store,
  ShoppingBag,
  PackageSearch,
  SquarePlus,
  ClipboardList,
  Brush,
  UserRoundCog,
  BarChart3,
} from "lucide-react";

import { getAllCategories, getAllProductsByStoreId } from "../services/api";
import { AuthContext } from "../contexts/AuthContext";
import { StoreProvider, StoreContext } from "../contexts/StoreContext.jsx";
export default function StoreAdminPage() {
  const location = useLocation();
  const { user, sellerStore } = useContext(AuthContext);

  const [allCategoriesList, setAllCategoriesList] = useState([]);
  const [storeProducts, setStoreProducts] = useState([]);

  const [collapsed, setCollapsed] = useState(false);

  // abrir/cerrar secciones
  const [openSection, setOpenSection] = useState(null);
  const [openSubSection, setOpenSubSection] = useState(null);

  // detectar qué item está activo por URL
  const currentPath = location.pathname;
  const isActive = (path) => currentPath === path;
  const isActiveStarts = (base) => currentPath.startsWith(base);

  // abrir automáticamente secciones según URL
  useEffect(() => {
    if (isActiveStarts("/store-admin/productos")) {
      setOpenSubSection("productos");
    }
  }, [currentPath]);

  const fetchAllCategories = async () => {
    try {
      const all = await getAllCategories();
      setAllCategoriesList(all);
      console.log("AdminPage - ALL store categories:", all);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      if (sellerStore?._id) {
        const products = await getAllProductsByStoreId(sellerStore._id);
        setStoreProducts(products);
      }
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  useEffect(() => {
    if (sellerStore?._id) {
      fetchAllCategories();
      fetchProducts();
    }
  }, [sellerStore?._id]);

  // detectar el breakpoint lg para colapsar el sidebar en pantallas pequeñas
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const handleBreakpointChange = (e) => {
      // si es menor que lg → colapsar
      setCollapsed(!e.matches);
    };

    // estado inicial
    setCollapsed(!mediaQuery.matches);

    // escuchar cambios
    mediaQuery.addEventListener("change", handleBreakpointChange);

    return () => {
      mediaQuery.removeEventListener("change", handleBreakpointChange);
    };
  }, []);

  return (
    <div className="w-full min-h-screen flex abasis-1 bg-gray-100">
      {/* SIDEBAR */}
      <aside
        className={`bg-secondary/80 shadow-lg transition-[width] duration-300 flex flex-col overflow-x-hidden ${collapsed ? "w-16" : "w-64"
          }`}
      >
        {/* Header del sidebar */}
        <div className="flex items-center justify-between p-3 border-b border-white/30 shadow-md mb-3">
          {!collapsed && (
            <>
              <Image
                removeWrapper
                alt={sellerStore?.name}
                className="h-8 w-auto border-2 border-white rounded-md"
                src={sellerStore?.logo}
              />
              <h1 className="text-xl font-semibold text-white">Dashboard</h1>
            </>
          )}

          <Button
            isIconOnly
            radius="full"
            variant="light"
            className="text-white"
            onPress={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </Button>
        </div>

        {/* NAV */}
        <nav className="flex-1 overflow-y-auto p-2">
          {/* --- Dashboard Link --- */}
          <Button
            as={Link}
            to="/store-admin/dashboard"
            variant="light"
            className={`w-full justify-start mb-2 ${isActive("/store-admin/dashboard") || isActive("/store-admin/")
              ? "bg-white/40 font-semibold text-secondary"
              : "text-white"
              }`}
          >
            <BarChart3
              size={18}
              className={`${isActive("/store-admin/dashboard") || isActive("/store-admin/")
                ? "text-secondary"
                : "text-white"
                }`}
            />
            {!collapsed && "Dashboard"}
          </Button>
          <Button
            as={Link}
            to="/store-admin/apariencia"
            variant="light"
            className={`w-full justify-start mb-2 ${isActive("/store-admin/apariencia")
              ? "bg-white/40 font-semibold text-secondary"
              : "text-white"
              }`}
          >
            <Brush
              size={18}
              className={`${isActive("/store-admin/apariencia")
                ? "text-secondary"
                : "text-white"
                }`}
            />
            {!collapsed && "Apariencia"}
          </Button>

          {/* --- Tienda --- */}
          <Button
            as={Link}
            to="/store-admin/tienda"
            variant="light"
            className={`w-full justify-start mb-2 ${isActive("/store-admin/tienda")
              ? "bg-white/40 font-semibold text-secondary"
              : "text-white"
              }`}
          >
            <Store
              size={18}
              className={`${isActive("/store-admin/tienda")
                ? "text-secondary"
                : "text-white"
                }`}
            />
            {!collapsed && "Tienda"}
          </Button>

          {/* --- Productos --- */}
          <Button
            variant="light"
            className={`w-full justify-start mb-2 ${isActiveStarts("/store-admin/productos")
              ? "bg-white/40 font-semibold text-secondary"
              : "text-white"
              }`}
            onPress={() =>
              setOpenSubSection(
                openSubSection === "productos" ? null : "productos"
              )
            }
          >
            <ShoppingBag
              size={18}
              className={`${isActiveStarts("/store-admin/productos")
                ? "text-secondary"
                : "text-white"
                }`}
            />
            {!collapsed && "Productos"}
            {!collapsed && (
              <ChevronDown
                className={`ml-auto transition-transform ${openSubSection === "productos" ? "rotate-180" : ""
                  }`}
              />
            )}
          </Button>

          {/* Submenú Productos */}
          {!collapsed && openSubSection === "productos" && (
            <div className="pl-6 pb-2 flex flex-col gap-2">
              <Button
                as={Link}
                to="/store-admin/productos/todos"
                variant="light"
                className={`w-full justify-start ${isActive("/store-admin/productos/todos")
                  ? "text-white/70 bg-primary/20 font-semibold"
                  : "text-white"
                  }`}
              >
                <PackageSearch
                  size={18}
                  className={`${isActive("/store-admin/productos/todos")
                    ? "text-white/70"
                    : "text-white"
                    }`}
                />
                Ver todos
              </Button>

              <Button
                as={Link}
                to="/store-admin/productos/nuevo"
                variant="light"
                className={`w-full justify-start ${isActive("/store-admin/productos/nuevo")
                  ? "text-white/70 bg-primary/20 font-semibold"
                  : "text-white"
                  }`}
              >
                <SquarePlus
                  size={18}
                  className={`${isActive("/store-admin/productos/nuevo")
                    ? "text-white/70"
                    : "text-white"
                    }`}
                />
                Añadir producto
              </Button>
            </div>
          )}

          {/* --- Pedidos --- */}
          <Button
            as={Link}
            to="/store-admin/pedidos"
            variant="light"
            className={`w-full justify-start ${isActive("/store-admin/pedidos")
              ? "bg-white/40 font-semibold text-secondary"
              : "text-white"
              }`}
          >
            <ClipboardList
              size={18}
              className={`${isActive("/store-admin/pedidos")
                ? "text-secondary"
                : "text-white"
                }`}
            />
            {!collapsed && "Pedidos"}
          </Button>


        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-h-screen">
        <header className="bg-primary/20 shadow p-4 flex items-center gap-4">
          <h2 className="text-2xl font-semibold">{sellerStore?.name}</h2>
        </header>

        {/* AQUÍ SE RENDERIZAN TODAS LAS PÁGINAS /store-admin/... */}
        <div className="flex-1 p-5">
          <div className="admin-panel-wrapper">
            <div className="bg-white shadow rounded-xl p-5 max-w-[1600px] mx-auto">
              <StoreProvider
                initialStore={sellerStore}
                initialProducts={storeProducts}
                initialCategories={allCategoriesList}
              >
                <Outlet
                  context={{
                    user,
                    sellerStore,
                    allCategoriesList,
                  }}
                />
              </StoreProvider>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
