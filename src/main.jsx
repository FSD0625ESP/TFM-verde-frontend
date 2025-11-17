import React from "react";
import ReactDOM from "react-dom/client";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <GoogleOAuthProvider
          clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ""}
        >
          <HeroUIProvider>
            <ToastProvider placement="top-right" />
            <App />
          </HeroUIProvider>
        </GoogleOAuthProvider>
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);
