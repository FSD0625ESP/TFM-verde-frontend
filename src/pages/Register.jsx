import Register from "../components/Register/Register";
import { useState } from "react";
import RegisterIlustration from "./../assets/register_ilustration.png";
import { Button, Card } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowBigLeftDash, Handshake, User } from "lucide-react";


export default function RegisterPage() {
    const [registerType, setRegisterType] = useState("");

    return (
        <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold text-primary uppercase">
                Regístrate
            </h1>
            <div className=" flex flex-col md:flex-row items-center justify-center bg-white p-8">
                {/* Columna izquierda */}
                <div className="md:w-1/2 flex flex-col items-center text-center space-y-4">
                    <img
                        src={RegisterIlustration}
                        alt="Registro ilustración"
                        className="w-80 h-auto"
                    />
                </div>

                {/* Columna derecha */}
                <div className="md:w-1/2 relative">
                    <AnimatePresence mode="wait">
                        {registerType === "user" ? (
                            <motion.div
                                key="register-form"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                            >
                                <Card
                                    shadow="lg"
                                    className="w-full max-w-md bg-primary-200 rounded-[2rem] p-8 pt-12 mt-8 md:mt-0 md:ml-8"
                                >
                                    <Button className="absolute opacity-50 top-3 left-4 rounded-full p-0 w-7 h-7 min-w-0" color="secondary" onClick={() => setRegisterType("")}>
                                        <ArrowBigLeftDash />
                                    </Button>
                                    <Register />
                                </Card>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="register-buttons"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="flex flex-col items-center space-y-4 mt-8 md:mt-0 md:ml-8"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-full"
                                >
                                    <Button
                                        className="w-full text-white text-lg py-6 rounded-2xl"
                                        color="primary"
                                        onClick={() => setRegisterType("user")}
                                    >
                                        <User className="mr-2" />  Usuario
                                    </Button>
                                </motion.div>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-full"
                                >
                                    <Button
                                        className="w-full  text-white text-lg py-6 rounded-2xl"
                                        color="secondary"
                                        onClick={() => setRegisterType("company")}
                                    >
                                        <Handshake className="mr-2" />  Vendedor
                                    </Button>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div >
    );
}