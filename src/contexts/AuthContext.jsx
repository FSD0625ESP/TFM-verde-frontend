import { useState, useEffect } from "react";
import {
  loginUser,
  getUser,
  getStoreBySellerId,
  logoutUser,
  loginWithGoogle,
} from "../services/api";
import React from "react";
export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        getUser(parsedUser)
          .then((data) => {
            console.log("Fetched user on AuthProvider mount:", data);
            setUser(data);
            console.log("User fetched:", data);
          })
          .catch((error) => {
            console.error("Failed to fetch user:", error);
          });
      } catch (error) {
        console.error("Failed to parse stored user:", error);
      }
    }
  }, []);

  const [sellerStore, setSellerStore] = useState([]);
  const fetchSellerStore = async () => {
    if (!user) return;
    try {
      const data = await getStoreBySellerId(user._id);
      setSellerStore(data);
      console.log("fetchStore - store", data);
    } catch (error) {
      console.error("Error fetching stores:", error);
    }
  };

  useEffect(() => {
    if (!user) return;
    if (user.role !== "seller") return;
    fetchSellerStore();
  }, [user]);

  const loginWithGoogleContext = async (idToken) => {
    try {
      const data = await loginWithGoogle(idToken);
      console.log("✅ Login with Google exitoso:", data);
      setUser({ ...data.user });
      localStorage.setItem("user", JSON.stringify(data.user));
      return data;
    } catch (error) {
      console.error("Login with Google error:", error);
      throw error; // Re-lanzar el error para que el componente lo maneje
    }
  };

  const login = async (email, password) => {
    try {
      const data = await loginUser(email, password);
      if (!data || !data.user) {
        console.error("❌ No hay user en la respuesta:", data);
        throw new Error(data?.msg || "Error en el inicio de sesión");
      }
      console.log("✅ Login exitoso:", data);
      setUser({ ...data.user });
      console.log("User set in context:", data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error; // Re-lanzar el error para que el componente lo maneje
    }
  };
  const logout = () => {
    return logoutUser()
      .then(() => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("sessionId");
        localStorage.removeItem("authToken");
        // Dar tiempo al navegador para procesar la eliminación de la cookie
        setTimeout(() => {
          window.location.href = "/";
        }, 300);
      })
      .catch((error) => {
        console.error("Logout failed:", error);
        // Incluso si el logout falla en el backend, limpiar el estado local
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("sessionId");
        localStorage.removeItem("authToken");
        window.location.href = "/";
      });
  };

  const updateUser = (updatedUserData) => {
    const newUser = { ...user, ...updatedUserData };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, updateUser, sellerStore, login, logout, loginWithGoogleContext }}
    >
      {children}
    </AuthContext.Provider>
  );
};
