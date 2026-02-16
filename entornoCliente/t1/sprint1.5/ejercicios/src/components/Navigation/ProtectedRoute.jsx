// src/components/Navigation/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { getSession } from "../../services/storage";

const ProtectedRoute = ({ children }) => {
    return getSession() ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
