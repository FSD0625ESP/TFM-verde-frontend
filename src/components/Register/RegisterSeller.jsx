import { useState } from "react";
import {
    Input,
    Button,
    Checkbox,
    Textarea,
} from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { registerUser, registerStore } from "../../services/api";
import { addToast } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { User, Store, CreditCard } from "lucide-react";

// ✅ Esquema de validación con Zod
const registerSchema = z
    .object({
        firstName: z.string().min(2, "El nombre es obligatorio"),
        lastName: z.string().min(2, "Los apellidos son obligatorios"),
        email: z.string().email("Email no válido"),
        password: z.string().min(6, "Mínimo 6 caracteres"),
        verifyPassword: z.string(),
        storeName: z.string().min(3, "El nombre de la tienda es obligatorio"),
        description: z.string().min(10, "Describe un poco más tu tienda"),
        billingName: z.string().optional(),
        billingAddress: z.string().optional(),
        billingPhone: z.string().optional(),
        billingEmail: z.string().optional(),
        instagram: z.string().url("Debe ser un enlace válido").optional(),
        facebook: z.string().url("Debe ser un enlace válido").optional(),
        web: z.string().url("Debe ser un enlace válido").optional(),
        agree: z.boolean().refine((v) => v === true, {
            message: "Debes aceptar los términos",
        }),
    })
    .refine((data) => data.password === data.verifyPassword, {
        message: "Las contraseñas no coinciden",
        path: ["verifyPassword"],
    });

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            // 1️⃣ Registro del usuario
            const userRes = await registerUser(
                data.firstName,
                data.lastName,
                data.email,
                data.password,
                "seller"
            );
            console.log("Usuario registrado:", userRes);

            // 2️⃣ Registro de la tienda (relacionada al usuario)
            await registerStore({
                ownerId: userRes.user._id,
                name: data.storeName,
                description: data.description,
                billingInfo: {
                    name: data.billingName,
                    address: data.billingAddress,
                    phone: data.billingPhone,
                    email: data.billingEmail,
                }
            });

            addToast({
                title: "Registro exitoso",
                description: "Tu cuenta y tienda fueron creadas correctamente.",
                color: "success",
                duration: 5000,
            });
            navigate("/");
        } catch (error) {
            console.error(error);
            addToast({
                title: "Error en el registro",
                description: error.response?.data?.msg || "Inténtalo de nuevo más tarde.",
                color: "danger",
                duration: 5000,
            });
        } finally {
            setLoading(false);
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 w-full">
            <div className="flex flex-col md:flex-row gap-10">
                {/* 🧍 Datos del usuario */}
                <div className="flex flex-col gap-5 md:w-1/2 w-full border-b-2 md:border-b-0 md:border-r-2 border-gray-200 pb-6 md:pb-0 md:pr-8">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center gap-1">
                        <User className="w-5 h-5 mr-2" /> Datos personales
                    </h3>

                    <Input
                        label="Nombre"
                        placeholder="Tu nombre"
                        {...register("firstName")}
                        isInvalid={!!errors.firstName}
                        errorMessage={errors.firstName?.message}
                        isRequired
                        {...inputStyleProps}
                    />
                    <Input
                        label="Apellidos"
                        placeholder="Tus apellidos"
                        {...register("lastName")}
                        isInvalid={!!errors.lastName}
                        errorMessage={errors.lastName?.message}
                        isRequired
                        {...inputStyleProps}
                    />
                    <Input
                        label="Email"
                        type="email"
                        placeholder="example@correo.com"
                        {...register("email")}
                        isInvalid={!!errors.email}
                        errorMessage={errors.email?.message}
                        isRequired
                        {...inputStyleProps}
                    />
                    <Input
                        label="Contraseña"
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        {...register("password")}
                        isInvalid={!!errors.password}
                        errorMessage={errors.password?.message}
                        isRequired
                        {...inputStyleProps}
                    />
                    <Input
                        label="Confirmar contraseña"
                        type="password"
                        placeholder="Repite la contraseña"
                        {...register("verifyPassword")}
                        isInvalid={!!errors.verifyPassword}
                        errorMessage={errors.verifyPassword?.message}
                        isRequired
                        {...inputStyleProps}
                    />
                </div>

                {/* 🏪 Datos de la tienda */}
                <div className="flex flex-col gap-5 md:w-1/2 w-full md:pl-8 pt-6 md:pt-0">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center gap-1">
                        <Store className="w-5 h-5 mr-2" />
                        Información de la tienda
                    </h3>
                    <Input
                        label="Nombre de la tienda"
                        placeholder="Ej: Artesanías Meraki"
                        {...register("storeName")}
                        isInvalid={!!errors.storeName}
                        errorMessage={errors.storeName?.message}
                        isRequired
                        {...inputStyleProps}
                    />
                    <Textarea
                        label="Descripción"
                        placeholder="Cuéntanos sobre tu tienda..."
                        {...register("description")}
                        isInvalid={!!errors.description}
                        errorMessage={errors.description?.message}
                        isRequired
                        variant="flat"
                        classNames={{
                            inputWrapper: "bg-white data-[hover=true]:bg-white group-data-[focus=true]:bg-white",
                            input: "bg-white",
                        }}
                    />

                    <h4 className="text-sm font-semibold text-gray-600 mt-2 flex items-center gap-1">
                        <CreditCard className="w-5 h-5 mr-2" />
                        Información de facturación
                    </h4>
                    <Input label="Nombre" {...register("billingName")} placeholder="Nombre de facturación" {...inputStyleProps} />
                    <Input label="Dirección" {...register("billingAddress")} placeholder="Dirección fiscal" {...inputStyleProps} />
                    <Input label="Teléfono" {...register("billingPhone")} placeholder="Teléfono de contacto" {...inputStyleProps} />
                    <Input label="Email" type="email" {...register("billingEmail")} placeholder="Email de facturación" {...inputStyleProps} />


                </div>
            </div>

            {/* ✅ Checkbox de términos */}
            <div className="mt-4">
                <Checkbox {...register("agree")} color="primary">
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
                {errors.agree && (
                    <p className="text-sm text-danger mt-1">{errors.agree.message}</p>
                )}
            </div>

            {/* 🧩 Botón */}
            <Button
                type="submit"
                className="w-full bg-secondary text-white text-lg py-6 rounded-2xl"
                isLoading={loading}
            >
                Crear cuenta
            </Button>
        </form>
    );
};

export default Register;
