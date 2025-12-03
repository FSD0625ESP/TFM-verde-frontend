import React from "react";
import { Card, CardBody, Button, Input, Textarea } from "@heroui/react";
import { Heart, Leaf, Users } from "lucide-react";

export default function HazteVolunt() {
  return (
    <div className="bg-white text-gray-800 container mx-auto shadow-sm rounded-lg">
      {/* Título + descripción */}
      <div className="text-center max-w-3xl mx-auto pt-16 px-6 mb-10">
        <h1 className="text-4xl font-bold mb-4 text-black">Hazte voluntario</h1>
        <p className="text-lg text-black">
          Únete a nuestra comunidad de voluntarios y ayúdanos a impulsar el
          cambio hacia un comercio más humano y sostenible.
        </p>
      </div>

      {/* Contenido principal */}
      <section className="max-w-5xl mx-auto py-16 px-6 grid md:grid-cols-2 gap-10">
        {/* Beneficios */}
        <div className="flex flex-col gap-6">
          <Card shadow="sm">
            <CardBody className="flex flex-col items-center text-center">
              <Heart size={36} className="text-[#26A69A] mb-3" />
              <h3 className="font-semibold text-xl text-[#26A69A] mb-2">
                Apoya causas reales
              </h3>
              <p>
                Colabora en proyectos que fortalecen a pequeños comercios y
                productores sostenibles.
              </p>
            </CardBody>
          </Card>

          <Card shadow="sm">
            <CardBody className="flex flex-col items-center text-center">
              <Leaf size={36} className="text-[#26A69A] mb-3" />
              <h3 className="font-semibold text-xl text-[#26A69A] mb-2">
                Sostenibilidad
              </h3>
              <p>
                Contribuye a iniciativas ecológicas y al consumo responsable.
              </p>
            </CardBody>
          </Card>

          <Card shadow="sm">
            <CardBody className="flex flex-col items-center text-center">
              <Users size={36} className="text-[#26A69A] mb-3" />
              <h3 className="font-semibold text-xl text-[#26A69A] mb-2">
                Comunidad
              </h3>
              <p>
                Forma parte de una red de personas con valores y propósito
                común.
              </p>
            </CardBody>
          </Card>
        </div>

        {/* Formulario */}
        <Card shadow="sm">
          <CardBody>
            <h2 className="text-2xl font-semibold text-primary mb-6">
              ¡Inscríbete como voluntario!
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("¡Gracias por unirte a MERAKI como voluntario! 🌿");
              }}
              className="flex flex-col gap-4"
            >
              <Input
                label="Nombre completo"
                isRequired
                placeholder="Tu nombre"
              />
              <Input
                label="Correo electrónico"
                type="email"
                isRequired
                placeholder="tucorreo@ejemplo.com"
              />
              <Textarea
                label="¿Por qué te gustaría colaborar?"
                placeholder="Cuéntanos un poco sobre ti..."
              />
              <Button
                type="submit"
                color="success"
                className="bg-[#26A69A] text-white"
              >
                Enviar solicitud 💌
              </Button>
            </form>
          </CardBody>
        </Card>
      </section>
    </div>
  );
}
