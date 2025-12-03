import React from "react";
import { Card, CardBody, Button } from "@heroui/react";
import { Briefcase, Users, Globe } from "lucide-react";

export default function Empleo() {
  return (
    <div className="bg-white text-gray-800 container mx-auto shadow-sm rounded-lg">
      {/* Título + descripción */}
      <div className="text-center max-w-3xl mx-auto pt-16 px-6 mb-10">
        <h1 className="text-4xl font-bold mb-4 text-black">Empleo</h1>
        <p className="text-lg text-black">
          Únete a un equipo apasionado por el comercio justo, la sostenibilidad
          y la innovación local.
        </p>
      </div>

      {/* Contenido principal */}
      <section className="max-w-5xl mx-auto py-16 px-6 text-center">
        <p className="text-lg mb-10">
          En MERAKI buscamos personas con propósito. Si te motiva construir un
          mundo más justo y conectar a los pequeños productores con el público
          global, ¡te estamos esperando!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <Card shadow="sm">
            <CardBody className="flex flex-col items-center text-center">
              <Briefcase size={36} className="text-[#26A69A] mb-3" />
              <h3 className="font-semibold text-xl text-[#26A69A] mb-2">
                Puestos abiertos
              </h3>
              <p>
                Desarrolladores, diseñadores y comunicadores con pasión por el
                impacto social.
              </p>
            </CardBody>
          </Card>

          <Card shadow="sm">
            <CardBody className="flex flex-col items-center text-center">
              <Users size={36} className="text-[#26A69A] mb-3" />
              <h3 className="font-semibold text-xl text-[#26A69A] mb-2">
                Cultura de equipo
              </h3>
              <p>
                Colaboración, flexibilidad y crecimiento profesional son nuestra
                base.
              </p>
            </CardBody>
          </Card>

          <Card shadow="sm">
            <CardBody className="flex flex-col items-center text-center">
              <Globe size={36} className="text-[#26A69A] mb-3" />
              <h3 className="font-semibold text-xl text-[#26A69A] mb-2">
                Trabajo remoto
              </h3>
              <p>Ofrecemos oportunidades híbridas y totalmente remotas.</p>
            </CardBody>
          </Card>
        </div>

        <Button
          color="success"
          className="bg-[#26A69A] text-white text-lg px-8 py-6"
        >
          Enviar CV 📄
        </Button>
      </section>
    </div>
  );
}
