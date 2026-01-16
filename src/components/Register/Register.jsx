import React, { useState } from "react";
import { Input, Button, Checkbox } from "@heroui/react";
import { registerUser, loginWithGoogle, replaceAnonymousCart } from "../../services/api";
import { GoogleLogin } from "@react-oauth/google";
import { addToast } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const Register = () => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);
    const [isVisible2, setIsVisible2] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        verifyPassword: "",
        agree: false,
    });

    const toggleVisibility = () => setIsVisible(!isVisible);
    const toggleVisibility2 = () => setIsVisible2(!isVisible2);

    const validateFirstName = (value) => {
        if (!value) {
            return "El nombre es obligatorio";
        }
        if (value.length < 2) {
            return "El nombre debe tener al menos 2 caracteres";
        }
        return true;
    };

    const validateLastName = (value) => {
        if (!value) {
            return "Los apellidos son obligatorios";
        }
        if (value.length < 2) {
            return "Los apellidos deben tener al menos 2 caracteres";
        }
        return true;
    };

    const validatePassword = (value) => {
        if (!value) {
            return "La contraseña es obligatoria";
        }
        if (value.length < 6) {
            return "Mínimo 6 caracteres";
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
        const value = field === "agree" ? e.target.checked : e.target.value;
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if (!formData.agree) {
            addToast({
                title: "Error de validación",
                description: "Debes aceptar los términos y condiciones",
                color: "danger",
                duration: 4000,
            });
            return;
        }

        try {
            const oldSessionId = localStorage.getItem("sessionId");
            const response = await registerUser(
                formData.firstName,
                formData.lastName,
                formData.email,
                formData.password,
                "customer"
            );

            // Reemplazar carrito anónimo si existía
            if (oldSessionId && oldSessionId !== response.user._id) {
                try {
                    await replaceAnonymousCart(oldSessionId);
                    console.log("✅ Carrito anónimo reemplazado tras registro");
                } catch (cartError) {
                    console.error("Error al reemplazar carrito:", cartError);
                }
            }

            addToast({
                title: "Registro exitoso",
                description: response.msg || "Usuario registrado correctamente.",
                color: "success",
                duration: 5000,
            });
            window.location.href = "/";
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
        <form onSubmit={onSubmit} className="space-y-4">
            <Input
                label="Nombre"
                placeholder="Escribe aquí tu nombre"
                value={formData.firstName}
                onChange={handleChange("firstName")}
                validate={validateFirstName}
                isRequired
                {...inputStyleProps}
            />
            <Input
                label="Apellidos"
                placeholder="Escribe aquí tus apellidos"
                value={formData.lastName}
                onChange={handleChange("lastName")}
                validate={validateLastName}
                isRequired
                {...inputStyleProps}
            />
            <Input
                label="Email"
                placeholder="example@correo.com"
                type="email"
                value={formData.email}
                onChange={handleChange("email")}
                isRequired
                {...inputStyleProps}
            />
            <Input
                label="Password"
                placeholder="Enter password"
                type={isVisible ? "text" : "password"}
                value={formData.password}
                onChange={handleChange("password")}
                validate={validatePassword}
                isRequired
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
                value={formData.verifyPassword}
                onChange={handleChange("verifyPassword")}
                validate={validateVerifyPassword}
                isRequired
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
                <Checkbox
                    isSelected={formData.agree}
                    onChange={handleChange("agree")}
                    color="primary"
                >
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
                            const oldSessionId = localStorage.getItem("sessionId");
                            const googleData = await loginWithGoogle(credentialResponse.credential);

                            // Reemplazar carrito anónimo si existía
                            if (oldSessionId && oldSessionId !== googleData.user._id) {
                                try {
                                    await replaceAnonymousCart(oldSessionId);
                                    console.log("✅ Carrito anónimo reemplazado (Google Register)");
                                } catch (cartError) {
                                    console.error("Error al reemplazar carrito:", cartError);
                                }
                            }

                            addToast({
                                title: "Login con Google exitoso",
                                color: "success",
                                duration: 5000,
                            });
                            window.location.href = "/";
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
