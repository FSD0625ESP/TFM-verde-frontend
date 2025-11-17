import React, { useState, useEffect } from "react";
import { Button, Card, CardBody } from "@heroui/react";
import { Cookie } from "lucide-react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookiesAccepted");
    if (!accepted) {
      setTimeout(() => setVisible(true), 800);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-0 right-0 flex justify-center z-50 px-4">
      <Card
        shadow="sm"
        className="max-w-3xl w-full bg-white border border-gray-200 shadow-lg animate-slideUp"
      >
        <CardBody className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-8 p-4 sm:p-5">
          <div className="flex items-center gap-3 text-gray-700 text-sm sm:text-base">
            <Cookie className="text-[#26A69A] flex-shrink-0" size={24} />
            <p>
              Usamos cookies para mejorar tu experiencia y ofrecerte contenido
              personalizado. Al continuar navegando, aceptas nuestra{" "}
              <a
                href="/cookies"
                className="text-[#26A69A] font-medium hover:underline"
              >
                Política de cookies
              </a>
              .
            </p>
          </div>

          <Button
            color="success"
            className="bg-[#26A69A] text-white px-6 rounded-full hover:bg-[#2b9a87] transition"
            onPress={acceptCookies}
          >
            Aceptar
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
