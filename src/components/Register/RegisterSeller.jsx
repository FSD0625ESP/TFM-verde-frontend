import { useState } from "react";
import {
    Input,
    Button,
    Checkbox,
    Textarea,
} from "@heroui/react";
import { registerUser, registerStore } from "../../services/api";
import { addToast } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { User, Store, CreditCard } from "lucide-react";

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        verifyPassword: "",
        storeName: "",
        description: "",
        billingName: "",
        billingAddress: "",
        billingPhone: "",
        billingEmail: "",
        agree: false,
    });

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

    const validateStoreName = (value) => {
        if (!value) {
            return "El nombre de la tienda es obligatorio";
        }
        if (value.length < 3) {
            return "El nombre debe tener al menos 3 caracteres";
        }
        return true;
    };

    const validateDescription = (value) => {
        if (!value) {
            return "La descripción es obligatoria";
        }
        if (value.length < 10) {
            return "Describe un poco más tu tienda (mínimo 10 caracteres)";
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

        setLoading(true);
        try {
            // 1️⃣ Registro del usuario
            const userRes = await registerUser(
                formData.firstName,
                formData.lastName,
                formData.email,
                formData.password,
                "seller"
            );
            console.log("Usuario registrado:", userRes);

            // 2️⃣ Registro de la tienda (relacionada al usuario)
            await registerStore({
                ownerId: userRes.user._id,
                name: formData.storeName,
                description: formData.description,
                billingInfo: {
                    name: formData.billingName,
                    address: formData.billingAddress,
                    phone: formData.billingPhone,
                    email: formData.billingEmail,
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

    // para los inputs color blanco
    const inputStyleProps = {
        variant: "flat",
        classNames: {
            inputWrapper: "bg-white data-[hover=true]:bg-white group-data-[focus=true]:bg-white",
            input: "bg-white",
        },
    };

    return (
        <form onSubmit={onSubmit} className="space-y-8 w-full">
            <div className="flex flex-col md:flex-row gap-10">
                {/* 🧍 Datos del usuario */}
                <div className="flex flex-col gap-5 md:w-1/2 w-full border-b-2 md:border-b-0 md:border-r-2 border-gray-200 pb-6 md:pb-0 md:pr-8">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center gap-1">
                        <User className="w-5 h-5 mr-2" /> Datos personales
                    </h3>

                    <Input
                        label="Nombre"
                        placeholder="Tu nombre"
                        value={formData.firstName}
                        onChange={handleChange("firstName")}
                        validate={validateFirstName}
                        isRequired
                        {...inputStyleProps}
                    />
                    <Input
                        label="Apellidos"
                        placeholder="Tus apellidos"
                        value={formData.lastName}
                        onChange={handleChange("lastName")}
                        validate={validateLastName}
                        isRequired
                        {...inputStyleProps}
                    />
                    <Input
                        label="Email"
                        type="email"
                        placeholder="example@correo.com"
                        value={formData.email}
                        onChange={handleChange("email")}
                        isRequired
                        {...inputStyleProps}
                    />
                    <Input
                        label="Contraseña"
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        value={formData.password}
                        onChange={handleChange("password")}
                        validate={validatePassword}
                        isRequired
                        {...inputStyleProps}
                    />
                    <Input
                        label="Confirmar contraseña"
                        type="password"
                        placeholder="Repite la contraseña"
                        value={formData.verifyPassword}
                        onChange={handleChange("verifyPassword")}
                        validate={validateVerifyPassword}
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
                        value={formData.storeName}
                        onChange={handleChange("storeName")}
                        validate={validateStoreName}
                        isRequired
                        {...inputStyleProps}
                    />
                    <Textarea
                        label="Descripción"
                        placeholder="Cuéntanos sobre tu tienda..."
                        value={formData.description}
                        onChange={handleChange("description")}
                        validate={validateDescription}
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
                    <Input
                        label="Nombre"
                        placeholder="Nombre de facturación"
                        value={formData.billingName}
                        onChange={handleChange("billingName")}
                        {...inputStyleProps}
                    />
                    <Input
                        label="Dirección"
                        placeholder="Dirección fiscal"
                        value={formData.billingAddress}
                        onChange={handleChange("billingAddress")}
                        {...inputStyleProps}
                    />
                    <Input
                        label="Teléfono"
                        placeholder="Teléfono de contacto"
                        value={formData.billingPhone}
                        onChange={handleChange("billingPhone")}
                        {...inputStyleProps}
                    />
                    <Input
                        label="Email"
                        type="email"
                        placeholder="Email de facturación"
                        value={formData.billingEmail}
                        onChange={handleChange("billingEmail")}
                        {...inputStyleProps}
                    />
                </div>
            </div>

            {/* ✅ Checkbox de términos */}
            <div className="mt-4">
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
