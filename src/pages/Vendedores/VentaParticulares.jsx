import React from "react";
import { Card, CardBody, Button } from "@heroui/react";
import { ShoppingCart, Heart, Globe } from "lucide-react";
import { Link } from "react-router-dom";

export default function VentaParticulares() {
  return (
    <div className=" bg-white text-gray-800 container mx-auto shadow-sm rounded-lg">
      {/* Título + descripción */}
      <div className="text-center max-w-3xl mx-auto pt-16 px-6 mb-10">
        <h1 className="text-4xl font-bold mb-4 text-black">
          Venta a particulares
        </h1>
        <p className="text-lg text-black">
          Descubre productos únicos de pequeños productores y artesanos locales.
        </p>
      </div>

      {/* Tarjetas */}
      <section className="max-w-5xl mx-auto py-10 px-6 grid md:grid-cols-3 gap-6">
        <Card shadow="sm">
          <CardBody className="flex flex-col items-center text-center">
            <ShoppingCart size={36} className="text-primary mb-3" />
            <h3 className="font-semibold text-xl text-primary mb-2">
              Compra segura
            </h3>
            <p>Pagos confiables y entrega rápida para particulares.</p>
          </CardBody>
        </Card>

        <Card shadow="sm">
          <CardBody className="flex flex-col items-center text-center">
            <Heart size={36} className="text-primary mb-3" />
            <h3 className="font-semibold text-xl text-primary mb-2">
              Productos únicos
            </h3>
            <p>Apoya el comercio justo y descubre productos con historia.</p>
          </CardBody>
        </Card>

        <Card shadow="sm">
          <CardBody className="flex flex-col items-center text-center">
            <Globe size={36} className="text-primary mb-3" />
            <h3 className="font-semibold text-xl text-primary mb-2">
              Alcance nacional
            </h3>
            <p>Recibe tus productos en cualquier parte de España.</p>
          </CardBody>
        </Card>

        {/* Botón */}
        <div className="col-span-3 text-center mt-10">
          <Link to="/products">
            <Button
              color="success"
              className="bg-primary text-white text-lg px-8 py-6"
            >
              Explorar productos 🛒
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
