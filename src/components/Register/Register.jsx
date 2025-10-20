import React, { useState } from "react";
import { Input, Button, Checkbox, Card } from "@heroui/react";
import { registerUser } from "../../services/api";
import { addToast } from "@heroui/react";

const Register = () => {
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
            const response = await registerUser(firstName, lastName, email, password);
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

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                label="Nombre"
                placeholder="Escribe aquí tu nombre"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                isRequired
            />
            <Input
                label="Apellidos"
                placeholder="Escribe aquí tu nombre"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
            />
            <Input
                label="Email"
                placeholder="example@chakraui"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                isRequired
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
                        className="focus:outline-none"
                    >

                    </button>
                }
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
                        className="focus:outline-none"
                    >

                    </button>
                }
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
                className="w-full bg-secondary text-white text-lg py-6 rounded-2xl"
            >
                Crear cuenta
            </Button>
        </form>
    );
};

export default Register;
