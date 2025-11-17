import React from "react";
import { Card, CardBody, Button } from "@heroui/react";
import { Users, Briefcase, Globe } from "lucide-react";

export default function VentaProfesionales() {
  return (
    <div className="min-h-screen bg-[#f6fffd] text-gray-800">
      {/* Título + descripción */}
      <div className="text-center max-w-3xl mx-auto pt-16 px-6 mb-10">
        <h1 className="text-4xl font-bold mb-4 text-black">
          Venta a profesionales
        </h1>
        <p className="text-lg text-black">
          Accede a productos de calidad a precios especiales para negocios y
          distribuidores.
        </p>
      </div>

      {/* Tarjetas */}
      <section className="max-w-5xl mx-auto py-16 px-6 grid md:grid-cols-3 gap-6">
        <Card shadow="sm">
          <CardBody className="flex flex-col items-center text-center">
            <Briefcase size={36} className="text-[#26A69A] mb-3" />
            <h3 className="font-semibold text-xl text-[#26A69A] mb-2">
              Precios especiales
            </h3>
            <p>Ofertas adaptadas a compras al por mayor.</p>
          </CardBody>
        </Card>

        <Card shadow="sm">
          <CardBody className="flex flex-col items-center text-center">
            <Users size={36} className="text-[#26A69A] mb-3" />
            <h3 className="font-semibold text-xl text-[#26A69A] mb-2">
              Soporte dedicado
            </h3>
            <p>Atención personalizada para profesionales y negocios.</p>
          </CardBody>
        </Card>

        <Card shadow="sm">
          <CardBody className="flex flex-col items-center text-center">
            <Globe size={36} className="text-[#26A69A] mb-3" />
            <h3 className="font-semibold text-xl text-[#26A69A] mb-2">
              Distribución nacional
            </h3>
            <p>Recibe tus pedidos en cualquier parte de España rápidamente.</p>
          </CardBody>
        </Card>

        {/* Botón */}
        <div className="col-span-3 text-center mt-10">
          <Button
            color="success"
            className="bg-[#26A69A] text-white text-lg px-8 py-6"
          >
            Contactar con un asesor 📞
          </Button>
        </div>
      </section>
    </div>
  );
}
