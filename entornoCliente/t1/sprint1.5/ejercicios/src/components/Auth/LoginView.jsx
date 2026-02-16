// src/components/Auth/LoginView.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { setSession } from "../../services/storage";
import "../../styles/auth.css";

const LoginView = ({ onLogin = () => {} }) => {
    const navigate = useNavigate();

    const handleLogin = () => {
        setSession(true);  // activa sesión
        onLogin();         // actualiza estado en App.jsx
        navigate("/");     // redirige a ChatView
    };

    return (
        <div className="login-container">
            <h1>Login</h1>
            <p>Simulación de inicio de sesión</p>
            <button onClick={handleLogin}>Acceder</button>
        </div>
    );
};

export default LoginView;
