import React, { useState } from "react";
import { Input, Button, Checkbox, Card } from "@heroui/react";
import { registerUser, loginWithGoogle } from "../../services/api";
import { GoogleLogin } from "@react-oauth/google";
import { addToast } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const Register = () => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);
    const [isVisible2, setIsVisible2] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);
    const toggleVisibility2 = () => setIsVisible2(!isVisible2);

    // Zod schema with password policy: min 6, at least one uppercase and one number
    const schema = z
        .object({
            firstName: z.string().min(2, "El nombre es obligatorio"),
            lastName: z.string().min(2, "Los apellidos son obligatorios"),
            email: z.string().email("Email no válido"),
            password: z
                .string()
                .min(6, "Mínimo 6 caracteres")
                .regex(/(?=.*[A-Z])(?=.*\d)/, "La contraseña debe contener al menos una mayúscula y un número"),
            verifyPassword: z.string(),
            agree: z.boolean().refine((v) => v === true, { message: "Debes aceptar los términos" }),
        })
        .refine((data) => data.password === data.verifyPassword, {
            message: "Las contraseñas no coinciden",
            path: ["verifyPassword"],
        });

    const { register, handleSubmit, control, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: { agree: false },
    });

    const onSubmit = async (data) => {
        try {
            const response = await registerUser(data.firstName, data.lastName, data.email, data.password, "customer");
            navigate("/");
            addToast({
                title: "Registro exitoso",
                description: response.msg || "Usuario registrado correctamente.",
                color: "success",
                duration: 5000,
            });
        } catch (error) {
            addToast({
                title: "Error de registro",
                description: error.response?.data?.msg || "Error de registro.",
                color: "danger",
                duration: 5000,
            });
        }
    };

    const inputStyleProps = {
        variant: "flat",
        classNames: {
            inputWrapper: "bg-white data-[hover=true]:bg-white group-data-[focus=true]:bg-white",
            input: "bg-white",
        },
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
                label="Nombre"
                placeholder="Escribe aquí tu nombre"
                {...register("firstName")}
                isRequired
                isInvalid={!!errors.firstName}
                errorMessage={errors.firstName?.message}
                {...inputStyleProps}
            />
            <Input
                label="Apellidos"
                placeholder="Escribe aquí tu nombre"
                {...register("lastName")}
                isInvalid={!!errors.lastName}
                errorMessage={errors.lastName?.message}
                {...inputStyleProps}
            />
            <Input
                label="Email"
                placeholder="example@correo.com"
                type="email"
                {...register("email")}
                isRequired
                isInvalid={!!errors.email}
                errorMessage={errors.email?.message}
                {...inputStyleProps}
            />
            <Input
                label="Password"
                placeholder="Enter password"
                type={isVisible ? "text" : "password"}
                {...register("password")}
                isRequired
                isInvalid={!!errors.password}
                errorMessage={errors.password?.message}
                endContent={
                    <button
                        type="button"
                        onClick={toggleVisibility}
                        className="focus:outline-none text-default-400"
                    >
                        {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                }
                {...inputStyleProps}
            />
            <Input
                label="Confirma tu password"
                placeholder="Enter password"
                type={isVisible2 ? "text" : "password"}
                {...register("verifyPassword")}
                isRequired
                isInvalid={!!errors.verifyPassword}
                errorMessage={errors.verifyPassword?.message}
                endContent={
                    <button
                        type="button"
                        onClick={toggleVisibility2}
                        className="focus:outline-none text-default-400"
                    >
                        {isVisible2 ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                }
                {...inputStyleProps}
            />
            <div className="pt-2">
                <Controller
                    name="agree"
                    control={control}
                    render={({ field }) => (
                        <Checkbox {...field} isSelected={field.value} color="primary">
                            <span className="text-sm text-gray-700">
                                Al suscribirte, estás de acuerdo con los{" "}
                                <a
                                    href="#"
                                    className="underline text-secondary hover:text-primary-600"
                                >
                                    Términos de uso y Políticas de Privacidad
                                </a>
                            </span>
                        </Checkbox>
                    )}
                />
                {errors.agree && (
                    <p className="text-sm text-danger mt-1">{errors.agree.message}</p>
                )}
            </div>

            <Button
                type="submit"
                disableAnimation={false}
                className="w-full bg-secondary text-white text-lg py-6 rounded-2xl"
            >
                Crear cuenta
            </Button>
            <div className="pt-2">
                <GoogleLogin
                    width="100%"
                    shape="pill"
                    theme="outline"
                    className="w-full transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    text="continue_with"
                    onSuccess={async (credentialResponse) => {
                        try {
                            await loginWithGoogle(credentialResponse.credential);
                            navigate("/");
                            addToast({
                                title: "Login con Google exitoso",
                                color: "success",
                                duration: 5000,
                            });
                        } catch (error) {
                            addToast({
                                title: "Error con Google",
                                description: error.response?.data?.msg || "No se pudo iniciar sesión con Google",
                                color: "danger",
                                duration: 5000,
                            });
                        }
                    }}
                    onError={() => {
                        addToast({ title: "Google Auth cancelado", color: "warning" });
                    }}
                />
            </div>
        </form>
    );
};

export default Register;
