import "./Login.css";
import { Form, Input, Button } from "@heroui/react";
import { GoogleLogin } from "@react-oauth/google";
import { addToast } from "@heroui/react";
import React, { useState } from "react";
import { Eye, EyeOff, TriangleAlert } from "lucide-react";
import { AuthContext } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Login({ switchForm }) {
  const { user, login, loginWithGoogleContext } = React.useContext(AuthContext);
  const [action, setAction] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError(""); // Limpiar error previo
    const formData = new FormData(event.target);
    const email = formData.get("email");
    const password = formData.get("password");
    try {
      await login(email, password);
      console.log("Login successful");
      setAction("login successful");
      addToast({
        title: "Inicio de sesión exitoso",
        description: "Bienvenido de vuelta",
        color: "success",
        duration: 3000,
      });
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      setAction("login failed");
      const errorMessage = error.response?.data?.msg || error.message || "Usuario o contraseña incorrectos";
      setError(errorMessage);
      addToast({
        title: "Error de autenticación",
        description: errorMessage,
        color: "danger",
        duration: 5000,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full"
    >
      <Form
        /* Usar ancho completo para encajar en la columna padre */
        className="w-full flex flex-col gap-4"
        onReset={() => setAction("reset")}
        onSubmit={(e) => handleLogin(e)}
      >
        {/* Mensaje de error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-danger-50 border w-full border-danger-200 text-danger-700 px-4 py-3 rounded-lg text-sm"
          >
            <p className="font-medium flex items-center gap-2"><TriangleAlert className="text-amber-400" /> {error}</p>
          </motion.div>
        )}
        <Input
          isRequired
          label="Email"
          labelPlacement="outside"
          name="email"
          placeholder="Introduce tu email"
          type="email"
        />

        <div className="w-full">
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-default-700">
              Password
            </label>
            <a className="text-sm text-primary-600  cursor-pointer" onClick={switchForm}>
              Forgot password?
            </a>

          </div>
          <Input
            isRequired
            labelPlacement="outside"
            name="password"
            placeholder="Introduce tu contraseña"
            type={showPassword ? "text" : "password"}
            endContent={
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="focus:outline-none text-default-400">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
          />
        </div>



        <div
          className="flex gap-2"
        >
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Button color="primary" className="text-white" type="submit">
              Acceder
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Button type="reset" variant="flat">
              Resetear
            </Button>
          </motion.div>
        </div>
        <div className="pt-2">
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <GoogleLogin
              width="100%"
              shape="pill"
              theme="outline"
              text="continue_with"
              onSuccess={async (credentialResponse) => {
                try {
                  await loginWithGoogleContext(credentialResponse.credential);
                  navigate("/");
                  addToast({
                    title: "Login con Google exitoso",
                    color: "success",
                    duration: 4000,
                  });
                } catch (error) {
                  addToast({
                    title: "Error con Google",
                    description:
                      error.response?.data?.msg ||
                      "No se pudo iniciar sesión con Google",
                    color: "danger",
                    duration: 5000,
                  });
                }
              }}
              onError={() =>
                addToast({ title: "Google Auth cancelado", color: "warning" })
              }
            />
          </motion.div>

        </div>
      </Form>
    </motion.div>
  );
}
