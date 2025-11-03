import React, { useState } from "react";
import { Input, Button, Checkbox, Card } from "@heroui/react";
import { registerUser, loginWithGoogle } from "../../services/api";
import { GoogleLogin } from "@react-oauth/google";
import { addToast } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const Register = () => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);
    const [isVisible2, setIsVisible2] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [verifyPassword, setVerifyPassword] = useState("");
    const [agree, setAgree] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);
    const toggleVisibility2 = () => setIsVisible2(!isVisible2);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!agree) {
            addToast({
                title: "Debes aceptar los términos",
                color: "warning",
                duration: 4000,
            });
            return;
        }
        try {
            const response = await registerUser(firstName, lastName, email, password, "customer");
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
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                label="Nombre"
                placeholder="Escribe aquí tu nombre"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                isRequired
                {...inputStyleProps}
            />
            <Input
                label="Apellidos"
                placeholder="Escribe aquí tu nombre"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                {...inputStyleProps}
            />
            <Input
                label="Email"
                placeholder="example@chakraui"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                isRequired
                {...inputStyleProps}
            />
            <Input
                label="Password"
                placeholder="Enter password"
                type={isVisible ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                value={verifyPassword}
                onChange={(e) => setVerifyPassword(e.target.value)}
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
                <Checkbox isSelected={agree} onValueChange={setAgree} color="primary">
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
