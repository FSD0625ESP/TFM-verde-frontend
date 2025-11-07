import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Login from "../components/Login/Login";
import { Link } from "react-router-dom";
import { Card } from "@heroui/react";
import LoginIlustration from "../assets/login_ilustration.png";
import ForgotPassword from "../components/Login/ForgotPassword";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate, useParams } from "react-router-dom";

export default function LoginPage() {
    // hacer switch entre login y forgot password
    const [switchForm, setSwitchForm] = React.useState("login");
    const { token } = useParams();

    // Si hay token en la URL, mostramos el formulario de "forgot".
    React.useEffect(() => {
        if (token) {
            setSwitchForm("forgot");
        }
    }, [token]);

    const navigate = useNavigate();
    const { user } = React.useContext(AuthContext);
    const forgotFormSwitch = () => {
        navigate("/login/forgotPassword", { replace: true });
        setSwitchForm("forgot");
    }
    const backToLogin = () => {
        navigate("/login", { replace: true });
        setSwitchForm("login");
    };

    // Evitar realizar la navegación durante el render — hacerlo en un efecto.
    React.useEffect(() => {
        if (user) navigate("/");
    }, [user, navigate]);

    return (
        <div className="container mx-auto p-4 min-h-screen flex items-center justify-center ">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-5xl"
            >
                <Card className="w-full overflow-hidden rounded-[2rem] shadow-lg border-0">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        {/* Columna izquierda: formulario */}
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="order-2 md:order-1 p-8 md:p-12 flex flex-col justify-center "
                        >
                            {/* Animar el título con entrada/salida cuando cambie el formulario */}
                            <AnimatePresence mode="wait">
                                <motion.h1
                                    key={switchForm}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.18 }}
                                    className="text-2xl md:text-3xl font-bold text-primary-600 mb-6"
                                >
                                    {switchForm === "forgot" ? "Recuperar contraseña" : "LOGIN"}
                                </motion.h1>
                            </AnimatePresence>
                            {/* Renderizar solo uno de los formularios y animar la transición */}
                            <AnimatePresence mode="wait">
                                {switchForm === "forgot" ? (
                                    <ForgotPassword key="forgot" backToLogin={backToLogin} token={token} />
                                ) : (
                                    <Login key="login" switchForm={forgotFormSwitch} />
                                )}
                            </AnimatePresence>
                            <p className="mt-4 text-sm text-gray-500">
                                ¿No tienes una cuenta?{" "}
                                <Link className="text-primary-600 hover:underline" to="/register">
                                    Regístrate gratis
                                </Link>
                            </p>
                        </motion.div>

                        {/* Columna derecha: ilustración */}
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="order-1 md:order-2 relative bg-teal-100 flex justify-center items-center p-6 md:p-8"
                        >
                            <div className="absolute top-0 left-0 w-full h-full rounded-l-[2rem] md:rounded-[0_2rem_2rem_0] bg-teal-100"></div>
                            <img
                                src={LoginIlustration}
                                alt="Login Illustration"
                                className="relative z-10 w-3/4 md:w-full max-w-sm h-auto drop-shadow-md"
                            />
                        </motion.div>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}
