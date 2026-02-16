// src/components/Layout/AppLayout.jsx
import React from "react";
import SessionIndicator from "../Auth/SessionIndicator";

const AppLayout = ({ children, onLogout = () => {} }) => {
    return (
        <div>
            <header style={{ 
                padding: "1rem",
                borderBottom: "1px solid #ddd",
                marginBottom: "1rem",
                position: "relative",
                background: "white"
            }}>
                <h2>Mi App Intermodular</h2>

                <div style={{ position: "absolute", right: "1rem", top: "1rem" }}>
                    <SessionIndicator onLogout={onLogout} />
                </div>
            </header>

            <main style={{ padding: "1rem" }}>
                {children}
            </main>
        </div>
    );
};

export default AppLayout;
