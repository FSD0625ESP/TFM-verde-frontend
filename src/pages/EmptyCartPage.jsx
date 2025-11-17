// src/pages/CartPage.jsx
import React from "react";
import { Card, CardBody, Button, Spacer } from "@heroui/react";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f6fffd] text-gray-800">
      {/* Sección Hero */}
      <div className="bg-transparent text-black py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">Tu carrito</h1>
        <p className="text-lg">
          Revisa los productos que has agregado antes de finalizar tu compra
        </p>
      </div>

      {/* Contenido principal */}
      <section className="max-w-4xl mx-auto py-16 px-6 flex flex-col items-center gap-6">
        <Card shadow="sm" className="w-full max-w-md text-center">
          <CardBody>
            <ShoppingCart className="mx-auto mb-4 text-[#26A69A]" size={48} />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Tu carrito está vacío
            </h2>
            <p className="text-gray-600 mb-6">
              ¡Parece que aún no has agregado productos! Explora nuestras
              tiendas y encuentra lo que necesitas.
            </p>
            <Button
              color="success"
              className="bg-[#26A69A] text-white"
              onClick={() => navigate("/stores")}
            >
              Seguir comprando
            </Button>
          </CardBody>
        </Card>
      </section>
    </div>
  );
}
