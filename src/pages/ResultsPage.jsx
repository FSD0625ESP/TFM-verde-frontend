import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getAllCategories } from "../services/api";
import Filters from "../components/Filters/Filters";


export default function ResultadosPage() {
  const [params] = useSearchParams();
  const searchFromURL = params.get("search") || "";
  const [categories, setCategories] = useState([]);

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

  return (
    <div className="min-h-screen bg-linear-to-b from-green-50 to-gray-50">
      {/* Header */}
      <div className="bg-linear-to-r from-primary-500 to-secondary-500 text-white px-4 md:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Resultados de búsqueda</h1>
          <p className="text-white/90 text-lg">
            Mostrando resultados para: <span className="font-semibold">"{searchFromURL}"  </span>
          </p>
        </div>
      </div>

      {/* Contenido Principal */}
      {categories.length > 0 && (
        <Filters
          categoriesList={categories}
          searchTerm={searchFromURL}
          mode="both"
          showTabs={true}
        />
      )}
    </div>
  );
}
