import Register from "../components/Register/Register";
import RegisterSeller from "../components/Register/RegisterSeller";
import { useState, useEffect } from "react";
import compradorIlustration from "./../assets/comprador_ilustration.png";
import sellerIlustration from "./../assets/seller_ilustration.png";
import RegisterIlustration from "./../assets/register_ilustration.png";
import UserSellerIlustration from "./../assets/user_seller_ilustration.png";
import { Button, Card } from "@heroui/react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { ArrowBigLeftDash, Store, ShoppingCart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterPage({ seller = false, default: isDefault = false }) {
  // Determinar el tipo inicial basado en las props de la ruta
  const getInitialType = () => {
    if (seller) return "company";
    if (isDefault) return "user";
    return "";
  };

  const [registerType, setRegisterType] = useState(getInitialType);
  const [clicked, setClicked] = useState(getInitialType() ? getInitialType() : "");
  const navigate = useNavigate();

  // Actualizar el estado cuando cambien las props (navegación entre rutas)
  useEffect(() => {
    const newType = getInitialType();
    setRegisterType(newType);
    setClicked(newType || "");
  }, [seller, isDefault]);

  const fadeMotion = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
    exit: (custom) => ({
      opacity: 0,
      y: -30,
      transition: { duration: 0.4, delay: custom === "delayed" ? 0.2 : 0 },
    }),
  };

  const handleSelect = (type) => {
    setClicked(type);
    setTimeout(() => {
      setRegisterType(type);
      // Actualizar la URL según el tipo seleccionado
      if (type === "company") {
        navigate("/register/seller", { replace: true });
      } else if (type === "user") {
        navigate("/register/default", { replace: true });
      }
    }, 200);
  };

  const handleBack = () => {
    setClicked("");
    setRegisterType("");
    // Navegar a la ruta base de registro
    navigate("/register", { replace: true });
  };

  return (
    <div className="container relative mx-auto p-4 flex flex-col items-center justify-center">
      <Motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-6xl"
      >
        <Card className="w-full overflow-hidden rounded-[2rem] shadow-lg border-0">
          <div
            className={`grid grid-cols-1 ${registerType === "company" ? "md:grid-cols-3" : "md:grid-cols-2"
              }`}
          >
            {/* Columna izquierda (ilustraciones / buyer side) */}
            <div
              className={`order-2 md:order-1 p-8 md:p-12 flex flex-col items-center text-center justify-center gap-6 ${registerType === "company" ? "md:col-span-1" : ""
                }`}
            >
              <AnimatePresence
                mode="wait"
                custom={clicked === "company" ? "delayed" : undefined}
              >
                {registerType === "" ? (
                  <Motion.div
                    key="buyer-option"
                    variants={fadeMotion}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    custom={clicked === "company" ? "delayed" : undefined}
                    className={`w-full flex flex-col items-center transition-transform ${clicked === "user" ? "scale-105" : ""
                      }`}
                  >
                    <div className="w-full max-w-md mx-auto">
                      <Motion.img
                        src={compradorIlustration}
                        alt="Comprar"
                        className="w-64 mx-auto mb-6 drop-shadow-sm"
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      />
                      <h3 className="text-xl font-semibold text-primary-700 mb-3">
                        ¿Quieres comprar?
                      </h3>
                      <p className="text-gray-500 mb-6">
                        Accede a productos únicos de artesanos y crea tu cuenta
                        de comprador.
                      </p>
                      <Button
                        color="primary"
                        className={`text-white text-lg py-6 px-8 rounded-2xl w-full transition-all duration-300 ${clicked === "user"
                            ? "ring-4 ring-primary shadow-lg scale-105"
                            : "hover:scale-105"
                          }`}
                        onClick={() => handleSelect("user")}
                      >
                        <ShoppingCart className="mr-2" /> Quiero comprar
                      </Button>
                    </div>
                  </Motion.div>
                ) : registerType === "user" ? (
                  <Motion.div
                    key="register-ilustration"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.4 }}
                    className="w-full flex justify-center"
                  >
                    <img
                      src={RegisterIlustration}
                      alt="Registro comprador"
                      className="w-3/4 max-w-sm drop-shadow-md"
                    />
                  </Motion.div>
                ) : registerType === "company" ? (
                  <Motion.div
                    key="seller-ilustration"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.4 }}
                    className="w-full flex justify-center items-center"
                  >
                    <img
                      src={UserSellerIlustration}
                      alt="Registro vendedor"
                      className="w-3/4 max-w-sm drop-shadow-md"
                    />
                  </Motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            {/* Columna derecha (seller / formularios) */}
            <div
              className={`order-1 md:order-2 relative p-8 md:p-12 bg-teal-100 flex flex-col items-center ${registerType === "company" ? "md:col-span-2 p-0" : ""
                }`}
            >
              <AnimatePresence
                mode="wait"
                custom={clicked === "user" ? "delayed" : undefined}
              >
                {registerType === "" ? (
                  <Motion.div
                    key="seller-option"
                    variants={fadeMotion}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    custom={clicked === "user" ? "delayed" : undefined}
                    className={`w-full flex flex-col items-center transition-transform ${clicked === "company" ? "scale-105" : ""
                      }`}
                  >
                    <div className="w-full max-w-md mx-auto text-center">
                      <Motion.img
                        src={sellerIlustration}
                        alt="Vender"
                        className="h-64 mx-auto mb-6 drop-shadow-sm"
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      />
                      <h3 className="text-xl font-semibold text-secondary-700 mb-3">
                        ¿Quieres vender?
                      </h3>
                      <p className="text-gray-500 mb-6">
                        Comparte tus creaciones con el mundo creando una cuenta
                        de vendedor.
                      </p>
                      <Button
                        color="secondary"
                        className={`text-white text-lg py-6 px-8 rounded-2xl w-full transition-all duration-300 ${clicked === "company"
                            ? "ring-4 ring-secondary shadow-lg scale-105"
                            : "hover:scale-105"
                          }`}
                        onClick={() => handleSelect("company")}
                      >
                        <Store className="mr-2" /> Quiero vender
                      </Button>
                    </div>
                  </Motion.div>
                ) : registerType === "user" ? (
                  <Motion.div
                    key="register-user"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                    className="w-full flex justify-center"
                  >
                    <button
                      type="button"
                      onClick={handleBack}
                      className="absolute top-4  cursor-pointer left-5 inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:underline focus:outline-none"
                    >
                      <ArrowBigLeftDash className="w-4 h-4 cursor-pointer" />{" "}
                      Volver
                    </button>
                    <Register />
                  </Motion.div>
                ) : registerType === "company" ? (
                  <Motion.div
                    key="register-seller"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                    className="w-full flex justify-center"
                  >
                    <button
                      type="button"
                      onClick={handleBack}
                      className="absolute top-4  cursor-pointer left-5 inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:underline focus:outline-none"
                    >
                      <ArrowBigLeftDash className="w-4 h-4" /> Volver
                    </button>
                    <RegisterSeller />
                  </Motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>
        </Card>
      </Motion.div>

      <Motion.p className="mt-6 text-sm text-gray-500">
        ¿Ya tienes una cuenta?{" "}
        <span className="underline">
          <Link to="/login">Iniciar sesión</Link>
        </span>
      </Motion.p>
    </div>
  );
}
