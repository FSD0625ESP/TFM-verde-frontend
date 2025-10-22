import { useState, useEffect } from "react";
import { loginUser, getUser, logoutUser } from "../services/api";
import React from "react";
export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        getUser(JSON.parse(localStorage.getItem("user"))).then((data) => {
            console.log("Fetched user on AuthProvider mount:", data);
            setUser(data);
        }).catch((error) => {
            console.error("Failed to fetch user:", error);
        });
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
