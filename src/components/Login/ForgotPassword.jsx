import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input, Button } from "@heroui/react";
import { addToast } from "@heroui/react";
import { forgotPassword, verifyForgotPasswordToken } from "../../services/api";
import { motion } from "framer-motion";
import { ArrowBigLeftDash } from "lucide-react";

const ForgotPassword = ({ backToLogin }) => {
    const [token, setToken] = useState(null);
    const [email, setEmail] = useState(null);
    const { register, handleSubmit, formState } = useForm({
        resolver: zodResolver(
            z.object({
                token: token ? z.string().min(1) : z.null(),
                email: email ? z.string().email("Email no válido") : z.null(),
                password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
                verifyPassword: z.string(),
            })
                .refine((data) => data.password === data.verifyPassword, {
                    message: "Las contraseñas no coinciden",
                    path: ["verifyPassword"],
                })
        ),
    });

    const onSubmit = async (data) => {
        try {
            if (token) {
                await forgotPassword(token, data.password);
                addToast("Contraseña cambiada con éxito", { type: "success" });
            } else {
                const response = await verifyForgotPasswordToken(data.email);
                setToken(response.data.token);
            }
        } catch (error) {
            addToast(error.message, { type: "error" });
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
            <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
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
                            onChange={(e) => setEmail(e.target.value)}
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
