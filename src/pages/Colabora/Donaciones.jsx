import React from "react";
import { Card, CardBody, Button, Input } from "@heroui/react";
import { Gift, Heart, Globe } from "lucide-react";

export default function Donaciones() {
  return (
    <div className="bg-white text-gray-800 container mx-auto shadow-sm rounded-lg">
      {/* Título + descripción */}
      <div className="text-center max-w-3xl mx-auto pt-16 px-6 mb-10">
        <h1 className="text-4xl font-bold mb-4 text-black">Donaciones</h1>
        <p className="text-lg text-black">
          Tu apoyo permite que MERAKI continúe promoviendo un comercio justo y
          sostenible. ¡Cada contribución cuenta!
        </p>
      </div>

      {/* Contenido principal */}
      <section className="max-w-5xl mx-auto py-16 px-6 grid md:grid-cols-2 gap-10">
        {/* Información sobre donaciones */}
        <div className="flex flex-col gap-6">
          <Card shadow="sm">
            <CardBody className="flex flex-col items-center text-center">
              <Gift size={36} className="text-primary mb-3" />
              <h3 className="font-semibold text-xl text-primary mb-2">
                Transparencia
              </h3>
              <p>
                Sabes exactamente cómo se utiliza tu aporte, apoyando a
                proyectos concretos.
              </p>
            </CardBody>
          </Card>

          <Card shadow="sm">
            <CardBody className="flex flex-col items-center text-center">
              <Heart size={36} className="text-primary mb-3" />
              <h3 className="font-semibold text-xl text-primary mb-2">
                Impacto social
              </h3>
              <p>
                Con tu ayuda fortalecemos a pequeños productores y comunidades
                locales.
              </p>
            </CardBody>
          </Card>

          <Card shadow="sm">
            <CardBody className="flex flex-col items-center text-center">
              <Globe size={36} className="text-primary mb-3" />
              <h3 className="font-semibold text-xl text-primary mb-2">
                Proyectos globales
              </h3>
              <p>
                Participa en iniciativas que benefician a personas y comunidades
                de todo el mundo.
              </p>
            </CardBody>
          </Card>
        </div>

        {/* Formulario de donación */}
        <Card shadow="sm">
          <CardBody>
            <h2 className="text-2xl font-semibold text-primary mb-6">
              Realiza tu donación
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("¡Gracias por tu donación! 🌿");
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
                label="Cantidad a donar (€)"
                type="number"
                placeholder="50"
                isRequired
              />
              <Button
                type="submit"
                color="success"
                className="bg-primary text-white"
              >
                Donar 💚
              </Button>
            </form>
          </CardBody>
        </Card>
      </section>
    </div>
  );
}
