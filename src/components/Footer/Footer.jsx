import React from "react";
import { Link } from "react-router-dom";
import { Spacer, Image, Divider } from "@heroui/react";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import logo from "../../assets/logo.png";

export default function Footer() {
  return (
    <footer className="bg-[#26A69A] text-white py-10 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
        {/* Logo */}
        <div className="flex flex-col items-start col-span-2 sm:col-span-1">
          <Image src={logo} alt="Meraki logo" width={80} radius="none" />
          <p className="mt-2 font-semibold text-lg text-black"></p>
        </div>

        {/* Conócenos */}
        <div>
          <p className="font-bold mb-2 text-black">Conócenos</p>
          <Spacer y={0.3} />
          <Link to="/about" className="block hover:text-gray-200">
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
          <Link to="/open-store" className="block hover:text-gray-200">
            ¿Quieres abrir una tienda?
          </Link>
          <Link to="/sell-to-customers" className="block hover:text-gray-200">
            Venta a particulares
          </Link>
          <Link to="/sell-to-business" className="block hover:text-gray-200">
            Venta a profesionales
          </Link>
        </div>

        {/* Colabora */}
        <div>
          <p className="font-bold mb-2 text-black">Colabora</p>
          <Spacer y={0.3} />
          <Link to="/donate" className="block hover:text-gray-200">
            Donaciones
          </Link>
          <Link to="/jobs" className="block hover:text-gray-200">
            Empleo
          </Link>
          <Link to="/volunteer" className="block hover:text-gray-200">
            Hazte voluntario
          </Link>
        </div>

        {/* Legal */}
        <div>
          <p className="font-bold mb-2 text-black">Legal</p>
          <Spacer y={0.3} />
          <Link to="/terms" className="block hover:text-gray-200">
            Condiciones de uso
          </Link>
          <Link to="/privacy" className="block hover:text-gray-200">
            Aviso de privacidad
          </Link>
          <Link to="/cookies" className="block hover:text-gray-200">
            Cookies
          </Link>
        </div>

        {/* Redes sociales */}
        <div>
          <p className="font-bold mb-2 text-black">¡Encuéntranos!</p>
          <Spacer y={0.5} />
          <div className="flex space-x-3">
            <a href="#" aria-label="Facebook" className="hover:text-gray-200">
              <Facebook size={20} />
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-gray-200">
              <Twitter size={20} />
            </a>
            <a href="#" aria-label="LinkedIn" className="hover:text-gray-200">
              <Linkedin size={20} />
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-gray-200">
              <Instagram size={20} />
            </a>
          </div>
        </div>
      </div>

      <Divider className="my-6 bg-white/30" />

      <p className="text-center text-white/80 text-sm">
        © {new Date().getFullYear()} MERAKI. Todos los derechos reservados.
      </p>
    </footer>
  );
}
