// src/components/Auth/SessionIndicator.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { getSession, clearSession } from "../../services/storage";
import "../../styles/auth.css";

const SessionIndicator = ({ onLogout = () => {} }) => {
    const navigate = useNavigate();
    const isLoggedIn = getSession();

    const handleLogout = () => {
        clearSession();
        onLogout(); // Llamada segura
        navigate("/login");
    };

    return (
        <div className="session-indicator">
            {isLoggedIn ? (
                <button onClick={handleLogout}>Logout</button>
            ) : (
                <span>No hay sesión</span>
            )}
        </div>
    );
};

export default SessionIndicator;
