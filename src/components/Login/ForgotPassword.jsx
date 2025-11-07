import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input, Button } from "@heroui/react";
import { addToast } from "@heroui/react";
import { forgotPassword, verifyForgotPasswordToken, generateForgotPasswordToken } from "../../services/api";
import { motion } from "framer-motion";
import { ArrowBigLeftDash } from "lucide-react";

const ForgotPassword = ({ backToLogin, token }) => {
    useEffect(() => {
        if (token) {
            // verificar token
            console.log(token);
            verifyForgotPasswordToken(token)
                .then(() => {
                    addToast({
                        title: "Token verificado con éxito",
                        description: "Puedes cambiar tu contraseña ahora.",
                        color: "success",
                        duration: 4000,
                    });
                    // el endpoint actual devuelve { token }, si en el futuro devuelve email podríamos usarlo
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

    // Schema dinámico: si hay token requerimos las contraseñas, si no requerimos email
    const schemaEmail = z.object({
        email: z.string().email("Email no válido"),
    });
    const schemaPassword = z
        .object({
            password: z
                .string()
                .min(6, "La contraseña debe tener al menos 6 caracteres")
                .regex(/(?=.*[A-Z])(?=.*\d)/, "La contraseña debe contener al menos una mayúscula y un número"),
            verifyPassword: z.string(),
        })
        .refine((data) => data.password === data.verifyPassword, {
            message: "Las contraseñas no coinciden",
            path: ["verifyPassword"],
        });


    const { register, handleSubmit, formState } = useForm({
        resolver: zodResolver(token ? schemaPassword : schemaEmail),
    });

    const onSubmit = async (data) => {
        console.log("Datos del formulario:", data);
        console.log("Token:", token);
        console.log("Errores del formulario:", formState.errors);

        if (Object.keys(formState.errors).length > 0) {
            console.log("Hay errores de validación");
            return;
        }

        try {
            if (token) {
                await forgotPassword(token, data.password);
                addToast({
                    title: "Contraseña cambiada con éxito",
                    description: "Ahora puedes iniciar sesión con tu nueva contraseña.",
                    color: "success",
                    duration: 4000,
                });
            } else {
                await generateForgotPasswordToken(data.email);
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
                <a onClick={backToLogin} className="text-sm text-primary-600 cursor-pointer flex items-center gap-1">
                    <ArrowBigLeftDash size={16} /> Volver al login
                </a>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} key={token ? 'withToken' : 'noToken'} className="w-full flex flex-col gap-4">
                {token ? (
                    <>
                        <Input
                            label="Nueva contraseña"
                            type="password"
                            {...register("password")}
                            error={formState.errors?.password?.message}
                        />
                        <Input
                            label="Verificar contraseña"
                            type="password"
                            {...register("verifyPassword")}
                            error={formState.errors?.verifyPassword?.message}
                        />
                    </>
                ) : (
                    <>
                        <Input
                            label="Email"
                            type="email"
                            {...register("email")}
                            error={formState.errors?.email?.message}
                        />
                    </>
                )}
                <div className="flex gap-2">
                    <Button type="submit" className="mt-2">
                        {token ? "Cambiar contraseña" : "Enviar email de restauración"}
                    </Button>
                    <Button type="button" variant="flat" onClick={backToLogin} className="mt-2">
                        Cancelar
                    </Button>
                </div>
            </form>
        </motion.div>
    );
};

export default ForgotPassword;
