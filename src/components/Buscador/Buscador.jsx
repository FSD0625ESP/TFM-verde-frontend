import React, { useState } from "react";
import { Input } from "@heroui/react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Buscador({ mobile = false, className = "" }) {
  const [value, setValue] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    navigate(`/resultados?search=${encodeURIComponent(value)}`);
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <Input
        type="text"
        placeholder="Buscar productos, tiendas..."
        radius="lg"
        size="sm"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        classNames={{
          base: `${mobile ? "w-full" : "w-64 md:w-60 lg:w-96"}`,
          input: "text-gray-700 placeholder:text-gray-400",
          inputWrapper: "bg-white shadow-md hover:shadow-lg transition-shadow",
        }}
        endContent={
          <button type="submit">
            <Search className="text-gray-400 cursor-pointer" size={18} />
          </button>
        }
      />
    </form>
  );
}
