import React from "react";
import { Card, CardBody, Button } from "@heroui/react";
import { Store, Users, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AbrirTienda() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token"); // O tu método de verificación de sesión

  const handleOpenStore = () => {
    if (isLoggedIn) {
      navigate("/dashboard");
    } else {
      navigate("/register/seller");
    }
  };

  return (
    <div className="bg-white text-gray-800 container mx-auto shadow-sm rounded-lg">
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
              <Store size={36} className="text-primary mb-3" />
              <h3 className="font-semibold text-xl text-primary mb-2">
                Tu tienda online
              </h3>
              <p>
                Abre tu catálogo digital y llega a clientes de todo el país.
              </p>
            </CardBody>
          </Card>

          <Card shadow="sm">
            <CardBody className="flex flex-col items-center text-center">
              <Users size={36} className="text-primary mb-3" />
              <h3 className="font-semibold text-xl text-primary mb-2">
                Comunidad de apoyo
              </h3>
              <p>Conéctate con otros emprendedores y comparte experiencias.</p>
            </CardBody>
          </Card>

          <Card shadow="sm">
            <CardBody className="flex flex-col items-center text-center">
              <Globe size={36} className="text-primary mb-3" />
              <h3 className="font-semibold text-xl text-primary mb-2">
                Ventas globales
              </h3>
              <p>Amplía tu alcance y vende a clientes en toda España.</p>
            </CardBody>
          </Card>
        </div>

        {/* Botón Call to Action */}
        <div className="flex flex-col items-center justify-center">
          <Button
            size="lg"
            color="success"
            className="bg-primary text-white text-xl px-12 py-8 h-auto"
            onClick={handleOpenStore}
          >
            Abrir mi tienda 💚
          </Button>
          <p className="text-sm text-gray-600 mt-4 text-center">
            {isLoggedIn
              ? "Ir a tu panel de vendedor"
              : "Regístrate como vendedor en minutos"}
          </p>
        </div>
      </section>
    </div>
  );
}
