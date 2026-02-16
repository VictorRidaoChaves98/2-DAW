// src/components/Views/ConversationView.jsx
import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ConversationView = ({ setConversationId }) => {
    const { id } = useParams(); // lee el parámetro de ruta
    const scrollRef = useRef(null);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    const [conversation, setConversation] = useState(null);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                // Try to fetch messages for this conversation id; if it exists, we redirect to ChatView
                const res = await axios.get(`http://localhost:3001/conversations/${id}/messages`);
                const msgs = res.data || [];

                // Build a lightweight conversation object for preview
                const conv = { id, name: `Conversación ${id}`, messages: msgs };
                setConversation(conv);

                // Set the app-level conversation id so ChatView will show it (if parent provided prop)
                if (typeof setConversationId === "function") {
                    setConversationId(id);
                }

                // Navigate to main chat view to show the conversation
                navigate("/");
            } catch (err) {
                console.warn("Conversation not found on server", err?.message || err);
                setNotFound(true);
            }
        };

        load();
    }, [id, navigate, setConversationId]);

    // Restaurar scroll
    useEffect(() => {
        if (scrollRef.current) {
            const savedScroll = sessionStorage.getItem(`conversation_scroll_${id}`);
            if (savedScroll) scrollRef.current.scrollTop = Number(savedScroll);
            else messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [conversation, id]);

    const handleScroll = () => {
        if (scrollRef.current) {
            sessionStorage.setItem(`conversation_scroll_${id}`, scrollRef.current.scrollTop);
        }
    };

    if (notFound) {
        return (
            <div style={{ padding: '1rem' }}>
                <h2>Conversación no encontrada</h2>
                <p>No se encontró la conversación solicitada (id: {id}).</p>
                <button onClick={() => navigate('/conversaciones')}>Volver a Conversaciones</button>
            </div>
        );
    }

    if (!conversation) return <p style={{ padding: '1rem' }}>Cargando conversación...</p>;

    return (
        <div style={{ padding: "1rem" }}>
            <h1>{conversation.name || `Conversación ${id}`}</h1>
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                style={{
                    border: "1px solid #aaa",
                    padding: "1rem",
                    borderRadius: "5px",
                    height: "300px",
                    overflowY: "auto",
                    backgroundColor: "#5e5b5bff",
                }}
            >
                {conversation.messages.length === 0 && (
                    <p style={{ opacity: 0.6 }}>Sin mensajes en esta conversación.</p>
                )}

                {conversation.messages.map((msg, i) => (
                    <p key={i}>
                        <strong>{msg.role === "user" ? "Tú:" : "Qwen3:"}</strong> {msg.content}
                    </p>
                ))}

                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};

export default ConversationView;
