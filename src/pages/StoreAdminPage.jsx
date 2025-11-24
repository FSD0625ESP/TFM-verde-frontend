import { useEffect, useState, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Button,
  Image,
  Accordion,
  AccordionItem,
  Textarea,
  addToast,
} from "@heroui/react";
import Rating from "../components/Rating/Rating";
import { ChevronLeft, ChevronRight, Menu, ChevronDown } from "lucide-react";

import { getStoreById } from "../services/api";

import { AuthContext } from "../contexts/AuthContext";
import ProductForm from "../components/ProductForm/ProductForm";

export default function StoreAdminPage() {
  //obtenemos la id del producto de la url
  const { id: storeId } = useParams();

  const [store, setStore] = useState({});
  const [categoriesList, setCategoriesList] = useState([]);
  const [areCategoriesFiltered, setAreCategoriesFiltered] = useState(false);

  const { user } = useContext(AuthContext);
  console.log("user id", user?._id);

  function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }

  const fetchStore = async () => {
    try {
      const data = await getStoreById(storeId);
      setStore(data);
      console.log("fetchStore - store", data);
    } catch (error) {
      console.error("Error al obtener la tienda:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const allCategories = await getAllCategories();
      const categoriesFromStore = store?.categories || [];
      const filteredCategories = allCategories.filter((category) =>
        categoriesFromStore.includes(category._id)
      );
      setCategoriesList(filteredCategories);
      setAreCategoriesFiltered(true);
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
    }
  };
  console.log("categoriesList", categoriesList);

  useEffect(() => {
    fetchStore();
    console.log("useEffect launched");
  }, []);

  // Se ejecuta cuando store cambia y ya tiene datos
  useEffect(() => {
    if (store && store.categories) {
      fetchCategories();
    }
  }, [store]);

  const [collapsed, setCollapsed] = useState(false);
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="w-full min-h-[73vh] flex basis-1 flex-1 overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`bg-secondary/80 shadow-lg sticky top-[100px] h-full transition-all duration-300 flex flex-col ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          {!collapsed && (
            <>
              <Image
                removeWrapper
                alt={store.name}
                className="h-8 w-auto"
                src={store.logo}
              />
              <h1 className="text-xl font-semibold">Dashboard</h1>
            </>
          )}
          <Button
            isIconOnly
            radius="full"
            variant="light"
            onPress={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2">
          {/* Section 1 */}
          <div>
            <Button
              className="w-full justify-between"
              variant="light"
              onPress={() => toggleSection("sec1")}
            >
              <span className="flex items-center gap-2">
                {!collapsed && "Gestión"}
              </span>
              {!collapsed && (
                <ChevronDown
                  className={`transition-transform ${
                    openSection === "sec1" ? "rotate-180" : ""
                  }`}
                />
              )}
            </Button>
            {!collapsed && openSection === "sec1" && (
              <div className="pl-6 py-2 flex flex-col gap-2">
                <Button variant="light" className="justify-start">
                  Usuarios
                </Button>
                <Button variant="light" className="justify-start">
                  Productos
                </Button>
                <Button variant="light" className="justify-start">
                  Pedidos
                </Button>
              </div>
            )}
          </div>

          {/* Section 2 */}
          <div>
            <Button
              className="w-full justify-between"
              variant="light"
              onPress={() => toggleSection("sec2")}
            >
              <span className="flex items-center gap-2">
                {!collapsed && "Configuración"}
              </span>
              {!collapsed && (
                <ChevronDown
                  className={`transition-transform ${
                    openSection === "sec2" ? "rotate-180" : ""
                  }`}
                />
              )}
            </Button>
            {!collapsed && openSection === "sec2" && (
              <div className="pl-6 py-2 flex flex-col gap-2">
                <Button variant="light" className="justify-start">
                  Apariencia
                </Button>
                <Button variant="light" className="justify-start">
                  Cuenta
                </Button>
              </div>
            )}
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="bg-primary/20 shadow p-4 flex items-center gap-4">
          <Button
            isIconOnly
            variant="light"
            onPress={() => setCollapsed(!collapsed)}
          >
            <Menu />
          </Button>
          <h2 className="text-2xl font-semibold">{store.name}</h2>
        </header>

        <div className="flex-1 p-6 overflow-y-auto">
          <div className="bg-white shadow rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4">
              Añadir Nuevo Producto
            </h3>
            <p className="text-gray-700">
              Rellena el siguiente formulario para añadir un nuevo producto
            </p>
            <ProductForm />
          </div>
        </div>
      </main>
    </div>
  );
}
