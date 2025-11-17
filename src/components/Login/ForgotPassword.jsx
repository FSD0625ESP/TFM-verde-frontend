import React, { useEffect, useState } from "react";
import { Input, Button, addToast } from "@heroui/react";
import { forgotPassword, verifyForgotPasswordToken, generateForgotPasswordToken } from "../../services/api";
import { motion } from "framer-motion";
import { ArrowBigLeftDash } from "lucide-react";

const ForgotPassword = ({ backToLogin, token }) => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        verifyPassword: "",
    });

    useEffect(() => {
        if (token) {
            verifyForgotPasswordToken(token)
                .then(() => {
                    addToast({
                        title: "Token verificado con éxito",
                        description: "Puedes cambiar tu contraseña ahora.",
                        color: "success",
                        duration: 4000,
                    });
                })
                .catch((error) => {
                    addToast({
                        title: "Error al verificar token",
                        description:
                            error.response?.data?.msg ||
                            "Error al verificar token. Por favor, solicita un nuevo restablecimiento de contraseña.",
                        color: "danger",
                        duration: 4000,
                    });
                    console.error(error);
                    backToLogin();
                });
        }
    }, [token, backToLogin]);

    const validatePassword = (value) => {
        if (!value) {
            return "La contraseña es obligatoria";
        }
        if (value.length < 6) {
            return "La contraseña debe tener al menos 6 caracteres";
        }
        if (!/(?=.*[A-Z])(?=.*\d)/.test(value)) {
            return "La contraseña debe contener al menos una mayúscula y un número";
        }
        return true;
    };

    const validateVerifyPassword = (value) => {
        if (!value) {
            return "Debes repetir la contraseña";
        }
        if (value !== formData.password) {
            return "Las contraseñas no coinciden";
        }
        return true;
    };

    const handleChange = (field) => (e) => {
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            if (token) {
                await forgotPassword(token, formData.password);
                addToast({
                    title: "Contraseña cambiada con éxito",
                    description: "Ahora puedes iniciar sesión con tu nueva contraseña.",
                    color: "success",
                    duration: 4000,
                });
            } else {
                await generateForgotPasswordToken(formData.email);
                addToast({
                    title: "Restablecimiento de contraseña enviado con éxito",
                    description: "Por favor, revisa tu correo para restablecer tu contraseña.",
                    color: "success",
                    duration: 4000,
                });
                backToLogin();
            }
        } catch (error) {
            addToast({
                title: "Error al restablecer contraseña",
                description:
                    error.response?.data?.msg ||
                    "Error al restablecer contraseña. Por favor, intenta nuevamente.",
                color: "danger",
                duration: 4000,
            });
            console.error(error);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="w-full"
        >
            <div className="mb-4">
                <a
                    onClick={backToLogin}
                    className="text-sm text-primary-600 cursor-pointer flex items-center gap-1"
                >
                    <ArrowBigLeftDash size={16} /> Volver al login
                </a>
            </div>

            <form
                onSubmit={onSubmit}
                key={token ? "withToken" : "noToken"}
                className="w-full flex flex-col gap-4"
            >
                {token ? (
                    <>
                        <Input
                            label="Nueva contraseña"
                            type="password"
                            value={formData.password}
                            onChange={handleChange("password")}
                            validate={validatePassword}
                            isRequired
                        />
                        <Input
                            label="Verificar contraseña"
                            type="password"
                            value={formData.verifyPassword}
                            onChange={handleChange("verifyPassword")}
                            validate={validateVerifyPassword}
                            isRequired
                        />
                    </>
                ) : (
                    <Input
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange("email")}
                        isRequired
                    />
                )}

                <div className="flex gap-2">
                    <Button type="submit" className="mt-2">
                        {token ? "Cambiar contraseña" : "Enviar email de restauración"}
                    </Button>
                    <Button
                        type="button"
                        variant="flat"
                        onClick={backToLogin}
                        className="mt-2"
                    >
                        Cancelar
                    </Button>
                </div>
            </form>
        </motion.div>
    );
};

export default ForgotPassword;
