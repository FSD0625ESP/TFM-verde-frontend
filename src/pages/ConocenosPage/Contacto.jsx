import React, { useEffect } from "react";
import { Input, Textarea, Button, Card, CardBody } from "@heroui/react";
import { Mail, Phone, MapPin } from "lucide-react";
import { AuthContext } from "../../contexts/AuthContext";
import { contactFormSend } from "../../services/api";
import { addToast } from '@heroui/react';

export default function Contacto() {

  const { user } = React.useContext(AuthContext);
  const [nombre, setNombre] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [mensaje, setMensaje] = React.useState("");
  const [isSent, setIsSent] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      nombre,
      email,
      mensaje,
    };
    setIsSent(true);

    contactFormSend(formData)
      .then(() => {
        addToast({
          title: "Mensaje enviado",
          description: "Tu mensaje ha sido enviado correctamente.",
          color: "success",
          duration: 4000,
        });
      })
      .catch((error) => {
        console.error("Error al enviar el formulario de contacto:", error);
        addToast({
          title: "Error",
          description: "Hubo un error al enviar tu mensaje. Por favor, inténtalo de nuevo más tarde.",
          color: "danger",
          duration: 4000,
        });
      });
  }

  useEffect(() => {
    if (user) {
      console.log("Contacto Page - Setting email from user:", user.email);
      setNombre(user.firstName + " " + user.lastName || "");
      setEmail(user.email);
    }
  }, [user]);


  return (
    <div className="bg-white text-gray-800 container mx-auto shadow-sm rounded-lg">
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
            {isSent ? null : (<h2 className="text-2xl font-semibold text-primary mb-6">
              Envíanos un mensaje
            </h2>)}

            <form
              onSubmit={(e) => {
                handleSubmit(e);
              }}
              className="flex flex-col gap-4"
            >
              {isSent ? (<>
                <div className="flex flex-col items-center justify-center py-8 gap-4">
                  <div className="relative">
                    <div className="animate-[ping_1s_ease-in-out_3]">
                      <div className="absolute inset-0 rounded-full bg-primary/20"></div>
                    </div>
                    <div className="relative bg-primary/10 rounded-full p-6 animate-[bounce_1s_ease-in-out_2]">
                      <Mail className="w-12 h-12 text-primary" strokeWidth={2} />
                      <div className="absolute -top-1 -right-1 bg-primary rounded-full p-1">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <p className="text-primary font-medium text-center">¡Gracias por contactarnos! Te responderemos pronto.</p>
                </div>
              </>) : (<>
                <Input label="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre" isRequired />

                <Input
                  type="email"
                  label="Correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tucorreo@ejemplo.com"
                  isRequired />
                <Textarea
                  label="Mensaje"
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  placeholder="Escribe tu mensaje..."
                  isRequired />
                <Button
                  type="submit"
                  color="success"
                  className="bg-primary text-white"
                >
                  Enviar
                </Button></>)}
            </form>
          </CardBody>
        </Card>

        {/* Información de contacto */}
        <div className="flex flex-col justify-center gap-6">
          <div className="flex items-center gap-3">
            <Mail className="text-primary" />
            <p>contacto@meraki.com</p>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="text-primary" />
            <p>+34 600 123 456</p>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="text-primary" />
            <p>Madrid, España</p>
          </div>
        </div>
      </section>
    </div>
  );
}
