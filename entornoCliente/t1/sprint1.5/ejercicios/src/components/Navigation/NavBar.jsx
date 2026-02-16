// src/components/Navigation/NavBar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import "../../styles/layout.css";

const NavBar = () => {
    return (
        <nav className="navbar">
            <NavLink to="/" end>
                Chat
            </NavLink>
            <NavLink to="/conversaciones">
                Conversaciones
            </NavLink>
            <NavLink to="/pokedex">
                Pokédex
            </NavLink>
            <NavLink to="/ajustes">
                Ajustes
            </NavLink>
        </nav>
    );
};

export default NavBar;
