import React from "react";

const ErrorBlock = ({ title = "Error", message }) => {
    return (
        <div style={{ padding: "1rem", border: "1px solid #e74c3c", background: "#fdecea", color: "#b00020", borderRadius: 6 }} className="error-block">
            <strong>{title}</strong>
            {message && <div style={{ marginTop: 6 }}>{message}</div>}
        </div>
    );
};

export default ErrorBlock;
