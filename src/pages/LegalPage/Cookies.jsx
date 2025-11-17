import React from "react";
import { Divider } from "@heroui/react";

export default function Cookies() {
  return (
    <div className="min-h-screen bg-[#f6fffd] text-gray-800">
      <section className="max-w-4xl mx-auto py-16 px-6 leading-relaxed text-justify">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="text-4xl font-bold mb-4 text-black">
            Política de cookies
          </h1>
          <p className="text-lg text-black">
            En MERAKI utilizamos cookies para mejorar tu experiencia y ofrecerte
            un servicio más personalizado.
          </p>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold text-[#26A69A] mb-3">
              1. ¿Qué son las cookies?
            </h2>
            <p>
              Las cookies son pequeños archivos de información que un servidor
              web genera y envía a un navegador web. Los navegadores web
              almacenan las cookies que reciben durante un periodo de tiempo
              predeterminado, o durante la duración de la sesión de un usuario
              en un sitio web. Adjuntan las cookies correspondientes a cualquier
              solicitud futura que haga el usuario al servidor web.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-[#26A69A] mb-3">
              2. Tipos de cookies que utilizamos
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>Sesiones:</strong> nSesiones del usuario: las cookies
                ayudan a asociar la actividad del sitio web con un usuario
                específico. Una cookie de sesión contiene una cadena única (una
                combinación de letras y números) que relaciona la sesión de un
                usuario con los datos y contenidos relevantes para ese usuario.
              </li>
              <li>
                <strong>Seguimiento:</strong> algunas cookies registran los
                sitios web que visitan los usuarios. Esta información se envía
                al servidor que originó la cookie la próxima vez que el
                navegador tenga que cargar contenido de ese servidor. Con las
                cookies de seguimiento de terceros, este proceso tiene lugar
                cada vez que el navegador carga un sitio web que utiliza ese
                servicio de seguimiento.
              </li>
              <li>
                <strong>Personalización:</strong> permiten recordar tus
                preferencias.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-[#26A69A] mb-3">
              3. Gestión de cookies
            </h2>
            <p>
              Las cookies pueden utilizarse para registrar la actividad de
              navegación, incluso con fines publicitarios. Sin embargo, muchos
              usuarios no quieren que se realice un seguimiento de su
              comportamiento en línea. Los usuarios también carecen de
              visibilidad o control sobre lo que los servicios de seguimiento
              hacen con los datos que recopilan. Incluso cuando el seguimiento
              basado en cookies no está vinculado al nombre o al dispositivo de
              un usuario específico, con algunos tipos de seguimiento podría ser
              posible vincular un registro de la actividad de navegación de un
              usuario con su identidad real. Esta información podría utilizarse
              de muchas maneras, desde la publicidad no deseada hasta la
              vigilancia, el acoso o el hostigamiento de los usuarios. (Este no
              es el caso de todas las cookies).
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
