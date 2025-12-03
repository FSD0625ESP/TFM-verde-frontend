import React, { useState } from "react";
import { Input, Button } from "@heroui/react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

/**
 * Componente Buscador
 * Busca productos y tiendas por texto
 * La búsqueda inicial es solo por texto, los filtros se aplican en ResultadosPage
 */
export default function Buscador({ mobile = false, className = "" }) {
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;

    setIsLoading(true);
    // Navegar a página de resultados con el parámetro de búsqueda
    navigate(`/resultados?search=${encodeURIComponent(value)}`);

    // Resetear loading después de navegar
    setTimeout(() => { setIsLoading(false); setValue("") }, 1000);
  };

  const handleInputChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="w-full flex gap-2">
        <Input
          type="text"
          placeholder="Buscar productos, tiendas..."
          radius="lg"
          size={mobile ? "md" : "lg"}
          value={value}
          onChange={handleInputChange}
          classNames={{
            base: mobile ? "w-full" : "w-64 md:w-96 lg:w-[28rem]",
            input: "text-gray-700 placeholder:text-gray-500 font-medium",
            inputWrapper: "bg-white shadow-md hover:shadow-lg transition-shadow border-1 border-gray-100",
          }}
          isClearable
          onClear={() => setValue("")}
        />
        <Button
          type="submit"
          isIconOnly
          color="primary"
          radius="lg"
          size={mobile ? "md" : "lg"}
          className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-md hover:shadow-lg transition-shadow"
          isLoading={isLoading}
        >
          <Search size={20} />
        </Button>
      </div>
    </form>
  );
}
