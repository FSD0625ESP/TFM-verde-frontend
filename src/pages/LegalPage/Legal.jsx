import React from "react";
import { Button } from "@heroui/react";
import { Link } from "react-router-dom";

export default function Legal() {
  return (
    <div className=" text-white flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-4xl font-bold mb-4">Información Legal</h1>
      <p className="text-lg max-w-2xl mb-8">
        Consulta nuestras condiciones de uso, política de privacidad y aviso de
        cookies. Mantenemos la transparencia en todo momento.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          as={Link}
          to="/condiciones-uso"
          color="primary"
          className="bg-white text-primary"
        >
          Condiciones de uso
        </Button>
        <Button
          as={Link}
          to="/aviso-privacidad"
          color="primary"
          className="bg-white text-primary"
        >
          Aviso de privacidad
        </Button>
        <Button
          as={Link}
          to="/cookies"
          color="primary"
          className="bg-white text-primary"
        >
          Cookies
        </Button>
      </div>
    </div>
  );
}
