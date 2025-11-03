import { useState, useEffect } from "react";
import { loginUser, getUser, logoutUser } from "../services/api";
import React from "react";
export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                getUser(parsedUser).then((data) => {
                    console.log("Fetched user on AuthProvider mount:", data);
                    setUser(data);
                }).catch((error) => {
                    console.error("Failed to fetch user:", error);
                });
            } catch (error) {
                console.error("Failed to parse stored user:", error);
            }
        }
    }, []);

    const login = (email, password) => {
        loginUser(email, password).then((data) => {
            setUser(data.user);
            localStorage.setItem("user", JSON.stringify(data.user));
        }).catch((error) => {
            console.error("Login failed:", error);
        });
    };

    const logout = () => {
        logoutUser().then(() => {
            setUser(null);
            localStorage.removeItem("user");
        }).catch((error) => {
            console.error("Logout failed:", error);
        });
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

