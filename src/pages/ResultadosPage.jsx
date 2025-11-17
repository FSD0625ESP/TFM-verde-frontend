import { useState, useEffect } from "react";
import { Input, Card, CardBody, Image, Button } from "@heroui/react";
import { useSearchParams } from "react-router-dom";
import { searchProducts } from "../services/api"; // Usa tu API real

export default function ResultadosPage() {
  const [params] = useSearchParams();
  const searchFromURL = params.get("search") || "";

  const [searchTerm, setSearchTerm] = useState(searchFromURL);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔍 Cuando cambia el parámetro de URL -> realizar búsqueda real
  useEffect(() => {
    async function fetchData() {
      if (!searchFromURL) return;
      setLoading(true);

      try {
        const products = await searchProducts(
          1,
          searchFromURL,
          [],
          false,
          0,
          10000
        );

        setResults(products);
      } catch (err) {
        console.error("Error buscando productos:", err);
      }

      setLoading(false);
    }

    fetchData();
  }, [searchFromURL]);

  // Filtrar manualmente si el usuario escribe dentro del input local del header
  const filtered = results.filter((p) =>
    (p?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f6fffd] text-gray-800">
      <header className="bg-[#39c3a7] text-white px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">MERAKI</h1>

        {/* Buscador interno de la página */}
        <Input
          clearable
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md rounded-full bg-white text-gray-700"
        />
      </header>

      <main className="px-6 py-10">
        <h2 className="text-2xl font-semibold text-[#2b9a87] mb-6">
          Resultados para “{searchFromURL}”
        </h2>

        {loading && (
          <p className="text-center text-gray-500">Buscando productos...</p>
        )}

        {!loading && filtered.length === 0 && (
          <p className="text-center text-gray-500">
            No se encontraron resultados.
          </p>
        )}

        {!loading && filtered.length > 0 && (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((product) => (
              <Card
                key={product._id}
                shadow="sm"
                isPressable
                className="rounded-xl hover:scale-[1.03] transition-transform duration-200"
              >
                <Image
                  src={product.images?.[0]}
                  alt={product.name}
                  className="object-cover h-48 w-full"
                />
                <CardBody className="p-4 flex flex-col gap-2">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.description}</p>
                  <span className="text-[#39c3a7] font-semibold">
                    {product.price} €
                  </span>
                  <Button
                    color="success"
                    className="bg-[#39c3a7] text-white mt-2 rounded-full hover:bg-[#2b9a87]"
                  >
                    Ver producto
                  </Button>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
