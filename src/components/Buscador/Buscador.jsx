import React from "react";
import { Input } from "@heroui/react";
import { Search } from "lucide-react";

export default function Buscador({ mobile = false, className = "" }) {

  // En desktop, mostrar el input completo
  return (
    <div className={className}>
      <Input
        type="text"
        placeholder="Buscar productos, tiendas..."
        radius="lg"
        size="sm"
        classNames={{
          base: `${mobile ? "w-full" : "w-64 md:w-60 lg:w-96"}`,
          input: "text-gray-700 placeholder:text-gray-400",
          inputWrapper: "bg-white shadow-md hover:shadow-lg transition-shadow",
        }}
        endContent={
          <Search className="text-gray-400 cursor-pointer" size={18} />
        }
      />
    </div>
  );
}
