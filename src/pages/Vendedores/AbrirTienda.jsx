import React from "react";
import { Card, CardBody, Button, Input } from "@heroui/react";
import { Store, Users, Globe } from "lucide-react";

export default function AbrirTienda() {
  return (
    <div className="min-h-screen bg-[#f6fffd] text-gray-800">
      {/* Sección tipo Hero */}
      <div className="bg-transparent text-black py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">¿Quieres abrir una tienda?</h1>
        <p className="text-lg">
          Únete a MERAKI y vende tus productos de forma sencilla, sostenible y
          justa.
        </p>
      </div>

      <section className="max-w-5xl mx-auto py-16 px-6 grid md:grid-cols-2 gap-10">
        {/* Beneficios */}
        <div className="flex flex-col gap-6">
          <Card shadow="sm">
            <CardBody className="flex flex-col items-center text-center">
              <Store size={36} className="text-[#26A69A] mb-3" />
              <h3 className="font-semibold text-xl text-[#26A69A] mb-2">
                Tu tienda online
              </h3>
              <p>
                Abre tu catálogo digital y llega a clientes de todo el país.
              </p>
            </CardBody>
          </Card>

          <Card shadow="sm">
            <CardBody className="flex flex-col items-center text-center">
              <Users size={36} className="text-[#26A69A] mb-3" />
              <h3 className="font-semibold text-xl text-[#26A69A] mb-2">
                Comunidad de apoyo
              </h3>
              <p>Conéctate con otros emprendedores y comparte experiencias.</p>
            </CardBody>
          </Card>

          <Card shadow="sm">
            <CardBody className="flex flex-col items-center text-center">
              <Globe size={36} className="text-[#26A69A] mb-3" />
              <h3 className="font-semibold text-xl text-[#26A69A] mb-2">
                Ventas globales
              </h3>
              <p>Amplía tu alcance y vende a clientes en toda España.</p>
            </CardBody>
          </Card>
        </div>

        {/* Formulario */}
        <Card shadow="sm">
          <CardBody>
            <h2 className="text-2xl font-semibold text-[#26A69A] mb-6">
              Abre tu tienda hoy
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert(
                  "¡Gracias! Nos pondremos en contacto contigo para abrir tu tienda 🌿"
                );
              }}
              className="flex flex-col gap-4"
            >
              <Input
                label="Nombre completo"
                placeholder="Tu nombre"
                isRequired
              />
              <Input
                label="Correo electrónico"
                type="email"
                placeholder="tucorreo@ejemplo.com"
                isRequired
              />
              <Input
                label="Nombre de tu tienda"
                placeholder="Mi tienda MERAKI"
                isRequired
              />
              <Button
                type="submit"
                color="success"
                className="bg-[#26A69A] text-white"
              >
                Abrir tienda 💚
              </Button>
            </form>
          </CardBody>
        </Card>
      </section>
    </div>
  );
}
