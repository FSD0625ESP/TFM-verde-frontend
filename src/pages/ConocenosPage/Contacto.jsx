import React from "react";
import { Input, Textarea, Button, Card, CardBody } from "@heroui/react";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Contacto() {
  return (
    <div className="min-h-screen bg-[#f6fffd] text-gray-800">
      {/* Título + descripción */}
      <div className="text-center max-w-3xl mx-auto pt-16 px-6 mb-10">
        <h1 className="text-4xl font-bold mb-4 text-black">Contacto</h1>
        <p className="text-lg text-black">
          ¿Tienes preguntas, ideas o sugerencias? ¡Nos encantaría escucharte!
        </p>
      </div>

      {/* Contenido principal */}
      <section className="max-w-5xl mx-auto pb-16 px-6 grid md:grid-cols-2 gap-10">
        {/* Formulario */}
        <Card shadow="sm">
          <CardBody>
            <h2 className="text-2xl font-semibold text-[#26A69A] mb-6">
              Envíanos un mensaje
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Gracias por tu mensaje 🌿");
              }}
              className="flex flex-col gap-4"
            >
              <Input label="Nombre" placeholder="Tu nombre" isRequired />
              <Input
                type="email"
                label="Correo electrónico"
                placeholder="tucorreo@ejemplo.com"
                isRequired
              />
              <Textarea
                label="Mensaje"
                placeholder="Escribe tu mensaje..."
                isRequired
              />
              <Button
                type="submit"
                color="success"
                className="bg-[#26A69A] text-white"
              >
                Enviar
              </Button>
            </form>
          </CardBody>
        </Card>

        {/* Información de contacto */}
        <div className="flex flex-col justify-center gap-6">
          <div className="flex items-center gap-3">
            <Mail className="text-[#26A69A]" />
            <p>contacto@meraki.com</p>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="text-[#26A69A]" />
            <p>+34 600 123 456</p>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="text-[#26A69A]" />
            <p>Madrid, España</p>
          </div>
        </div>
      </section>
    </div>
  );
}
