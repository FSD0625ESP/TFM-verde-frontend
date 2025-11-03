import React from "react";
import { Link } from "react-router-dom";
import { Input } from "@heroui/react";
import { Search, UserPlus, Store, LogIn, ShoppingCart } from "lucide-react";
import logo from "../../assets/logo.png";

export default function Buscador() {
  return (
    <nav className="bg-[#26A69A] text-black py-3 px-6 flex items-center justify-between shadow-md">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img src={logo} alt="Meraki logo" className="h-10 w-auto" />
        <span className="font-semibold text-lg tracking-wide">MERAKI</span>
      </div>

      {/* Barra de búsqueda */}
      <div className="flex-1 max-w-xl mx-8">
        <div className="relative">
          <Input
            type="text"
            placeholder="Buscar"
            radius="lg"
            classNames={{
              input: "text-gray-700 placeholder:text-gray-400",
              inputWrapper: "bg-white shadow-sm",
            }}
            endContent={
              <Search className="text-gray-400 cursor-pointer" size={18} />
            }
          />
        </div>
      </div>

      {/* Enlaces de navegación */}
      <div className="flex items-center gap-6">
        <Link to="/" className="font-bold hover:text-white transition-colors">
          INICIO
        </Link>
        <Link
          to="/tiendas"
          className="font-bold hover:text-white transition-colors"
        >
          TIENDAS
        </Link>

        {/* Iconos de acciones */}
        <div className="flex items-center gap-5">
          <Link
            to="/registro"
            className="flex flex-col items-center text-sm hover:text-white"
          >
            <UserPlus size={20} />
            <span>Registro</span>
          </Link>
          <Link
            to="/tu-tienda"
            className="flex flex-col items-center text-sm hover:text-white"
          >
            <Store size={20} />
            <span>Tu tienda</span>
          </Link>
          <Link
            to="/login"
            className="flex flex-col items-center text-sm hover:text-white"
          >
            <LogIn size={20} />
            <span>Login</span>
          </Link>
          <Link
            to="/carrito"
            className="flex flex-col items-center text-sm hover:text-white"
          >
            <ShoppingCart size={20} />
            <span>Carrito</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
