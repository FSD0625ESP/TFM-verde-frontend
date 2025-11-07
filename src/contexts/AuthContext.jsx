import { useState, useEffect } from "react";
import { loginUser, getUser, logoutUser, loginWithGoogle } from "../services/api";
import React from "react";
export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        console.log("👤 User changed in Header:", user);
    }, [user]);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                getUser(parsedUser).then((data) => {
                    console.log("Fetched user on AuthProvider mount:", data);
                    setUser(data);
                    console.log("User fetched:", data);
                }).catch((error) => {
                    console.error("Failed to fetch user:", error);
                });
            } catch (error) {
                console.error("Failed to parse stored user:", error);
            }
        }
    }, []);


    const loginWithGoogleContext = async (idToken) => {
        try {
            const data = await loginWithGoogle(idToken);
            console.log("✅ Login with Google exitoso:", data);
            setUser({ ...data.user });
            localStorage.setItem("user", JSON.stringify(data.user));
        } catch (error) {
            console.error("Login with Google error:", error);
        }
    };

    const login = async (email, password) => {
        try {
            const data = await loginUser(email, password);
            if (!data || !data.user) {
                console.error("❌ No hay user en la respuesta:", data);
                return;
            }
            console.log("✅ Login exitoso:", data);
            setUser({ ...data.user });
            localStorage.setItem("user", JSON.stringify(data.user));
        } catch (error) {
            console.error("Login error:", error);
        }
    };
    const logout = () => {
        return logoutUser().then(() => {
            setUser(null);
            localStorage.removeItem("user");
        }).catch((error) => {
            console.error("Logout failed:", error);
            throw error;
        });
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loginWithGoogleContext }}>
            {children}
        </AuthContext.Provider>
    );
};

