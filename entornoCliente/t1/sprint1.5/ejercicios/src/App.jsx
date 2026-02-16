// src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import AppLayout from "./components/Layout/AppLayout";
import NavBar from "./components/Navigation/NavBar";

import ChatView from "./components/Views/ChatView";
import ConversationsView from "./components/Views/ConversationsView";
import ConversationView from "./components/Views/ConversationView";
import PokedexView from "./components/Views/PokedexView";
import SettingsView from "./components/Views/SettingsView";
import LoginView from "./components/Auth/LoginView";
import NotFoundView from "./components/Views/NotFoundView";

import { getSession } from "./services/storage";

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(() => getSession());
    const [conversationId, setConversationId] = useState(null); // Conversación activa

    // Mantener sesión sincronizada
    useEffect(() => {
        const interval = setInterval(() => {
            const current = getSession();
            if (current !== isLoggedIn) setIsLoggedIn(current);
        }, 500);
        return () => clearInterval(interval);
    }, [isLoggedIn]);

    return (
        <Router>
            <AppLayout onLogout={() => setIsLoggedIn(false)}>
                {isLoggedIn && <NavBar />}

                <Routes>
                    <Route
                        path="/login"
                        element={<LoginView onLogin={() => setIsLoggedIn(true)} />}
                    />

                    <Route path="*" element={<NotFoundView />} />

                    <Route
                        path="/"
                        element={isLoggedIn ? (
                            <ChatView
                                conversationId={conversationId}
                                setConversationId={setConversationId}
                            />
                        ) : <Navigate to="/login" replace />}
                    />

                    <Route
                        path="/conversaciones"
                        element={isLoggedIn ? (
                            <ConversationsView
                                conversationId={conversationId}
                                setConversationId={setConversationId}
                            />
                        ) : <Navigate to="/login" replace />}
                    />

                    <Route
                        path="/conversacion/:id"
                        element={isLoggedIn ? (
                            <ConversationView setConversationId={setConversationId} />
                        ) : <Navigate to="/login" replace />}
                    />

                    <Route
                        path="/pokedex"
                        element={isLoggedIn ? <PokedexView /> : <Navigate to="/login" replace />}
                    />

                    <Route
                        path="/ajustes"
                        element={isLoggedIn ? <SettingsView /> : <Navigate to="/login" replace />}
                    />
                </Routes>
            </AppLayout>
        </Router>
    );
};

export default App;
