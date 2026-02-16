import React from "react";

const Loading = ({ message = "Cargando..." }) => {
    return (
        <div style={{ padding: "1rem", textAlign: "center" }} className="loading-block">
            <p>{message}</p>
        </div>
    );
};

export default Loading;
