import "./Login.css";
import { Form, Input, Button } from "@heroui/react";
import React, { useState } from "react";
import { loginUser } from "../../services/api";

export default function Login() {
  const [action, setAction] = useState(null);

  const handleLogin = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = formData.get("email");
    const password = formData.get("password");
    try {
      const data = await loginUser(email, password);
      console.log("Login successful:", data);
      setAction("login successful");
    } catch (error) {
      console.error("Login failed:", error);
      setAction("login failed");
    }
  };


  return (
    <>
      <div className="login_wrapper">
        <div>
          <Form
            className="w-full max-w-xs flex flex-col gap-4"
            onReset={() => setAction("reset")}
            onSubmit={(e) => handleLogin(e)}
          >
            <Input
              isRequired
              label="Email"
              labelPlacement="outside"
              name="email"
              placeholder="Enter your email"
              type="email"
              validate={(value) => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                  return "Introduce un email válido";
                }
                return null;
              }}
            />

            <Input
              isRequired
              label="password"
              labelPlacement="outside"
              name="password"
              placeholder="Introduce tu contraseña"
              type="password"
              validate={(value) => {
                if (value.length < 6) {
                  return "La contraseña debe tener al menos 6 caracteres";
                }
                if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6,}$/.test(value)) {
                  return "La contraseña debe contener al menos una mayúscula, una minúscula y un número";
                }
                return null;
              }}
            />
            <p className="text-default-500">No tienes cuenta? <a href="/register">Registrate</a></p>

            <div className="flex gap-2">
              <Button color="primary" type="submit">
                Submit
              </Button>
              <Button type="reset" variant="flat">
                Reset
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}