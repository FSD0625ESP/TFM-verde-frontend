import React from "react";
import { Card, CardBody, Divider } from "@heroui/react";

export default function QuienesSomos() {
  return (
    <div className="bg-white text-gray-800 container mx-auto shadow-sm rounded-lg">
      {/* Título + descripción */}
      <div className="text-center max-w-3xl mx-auto pt-16 px-6 mb-10">
        <h1 className="text-4xl font-bold mb-4 text-black">¿Quiénes somos?</h1>
        <p className="text-lg text-black">
          En <span className="font-semibold">MERAKI</span> creemos en un
          comercio local, ético y sostenible. Conectamos a artesanos, tiendas de
          barrio y consumidores conscientes que valoran los productos hechos con
          amor y respeto por el entorno.
        </p>
      </div>

      {/* Contenido */}
      <section className="max-w-5xl mx-auto pb-16 px-6">
        <p className="text-lg mb-6">
          MERAKI nace con el propósito de transformar la forma en que compramos
          y vendemos...
        </p>

        <p className="text-lg mb-6">
          Trabajamos día a día para fomentar una economía circular y
          responsable...
        </p>

        <Divider className="my-10 bg-gray-200" />

        <h2 className="text-2xl font-semibold text-[#26A69A] mb-6 text-center">
          Nuestros valores
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card shadow="sm" className="text-center">
            <CardBody>
              <h3 className="text-xl font-semibold text-[#26A69A] mb-2">
                Sostenibilidad
              </h3>
              <p className="text-gray-600">
                Apostamos por un consumo responsable y productos respetuosos con
                el planeta.
              </p>
            </CardBody>
          </Card>

          <Card shadow="sm" className="text-center">
            <CardBody>
              <h3 className="text-xl font-semibold text-[#26A69A] mb-2">
                Comunidad
              </h3>
              <p className="text-gray-600">
                Apoyamos a los productores y tiendas locales.
              </p>
            </CardBody>
          </Card>

          <Card shadow="sm" className="text-center">
            <CardBody>
              <h3 className="text-xl font-semibold text-[#26A69A] mb-2">
                Transparencia
              </h3>
              <p className="text-gray-600">
                Creemos en la confianza y la comunicación honesta.
              </p>
            </CardBody>
          </Card>
        </div>
      </section>
    </div>
  );
}
