import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Spacer, Divider } from "@heroui/react";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import Logo from "../../assets/logo_white.svg?react";
import CookieBanner from "../CookieBanner"; // <-- Banner de cookies

export default function Footer() {
  const navigate = useNavigate();

  return (
    <>
      <footer className="bg-[#26A69A] text-white py-10 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
          {/* Logo MERAKI */}
          <div
            className="flex flex-col items-start cursor-pointer"
            onClick={() => navigate("/")}
          >
            <Logo className="w-20 p-1 h-auto text-white drop-shadow-md hover:drop-shadow-2xl hover:scale-105 transition-all" />
          </div>

          {/* Conócenos */}
          <div>
            <p className="font-bold mb-2 text-black">Conócenos</p>
            <Spacer y={0.3} />
            <Link to="/quienes-somos" className="block hover:text-gray-200">
              ¿Quiénes somos?
            </Link>
            <Link to="/contact" className="block hover:text-gray-200">
              Contacto
            </Link>
          </div>

          {/* Vendedores */}
          <div>
            <p className="font-bold mb-2 text-black">Vendedores</p>
            <Spacer y={0.3} />
            <Link to="/abrir-tienda" className="block hover:text-gray-200">
              ¿Quieres abrir una tienda?
            </Link>
            <Link
              to="/venta-particulares"
              className="block hover:text-gray-200"
            >
              Venta a particulares
            </Link>
            <Link
              to="/venta-profesionales"
              className="block hover:text-gray-200"
            >
              Venta a profesionales
            </Link>
          </div>

          {/* Colabora */}
          <div>
            <p className="font-bold mb-2 text-black">Colabora</p>
            <Spacer y={0.3} />
            <Link to="/donaciones" className="block hover:text-gray-200">
              Donaciones
            </Link>
            <Link to="/empleo" className="block hover:text-gray-200">
              Empleo
            </Link>
            <Link to="/hazte-volunt" className="block hover:text-gray-200">
              Hazte voluntario
            </Link>
          </div>

          {/* Legal */}
          <div>
            <p className="font-bold mb-2 text-black">Legal</p>
            <Spacer y={0.3} />
            <Link to="/condiciones-uso" className="block hover:text-gray-200">
              Condiciones de uso
            </Link>
            <Link to="/aviso-privacidad" className="block hover:text-gray-200">
              Aviso de privacidad
            </Link>
            <Link to="/cookies" className="block hover:text-gray-200">
              Cookies
            </Link>
          </div>
        </div>

        <Divider className="my-6 bg-white/30" />

        <p className="text-center text-white/80 text-sm">
          © {new Date().getFullYear()} MERAKI. Todos los derechos reservados.
        </p>
      </footer>

      {/* Banner de cookies */}
      <CookieBanner />
    </>
  );
}
