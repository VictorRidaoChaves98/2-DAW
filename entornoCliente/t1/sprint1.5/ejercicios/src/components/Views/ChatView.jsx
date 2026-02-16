// src/components/Views/ChatView.jsx
import React, { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
import { askAI } from "../../services/aiService";

const ChatView = ({ conversationId, setConversationId }) => {
    const inputRef = useRef(null);
    const messagesEndRef = useRef(null);
    const scrollRef = useRef(null);

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState("");

    // ⚡ Cargar la última conversación si no hay conversationId
    useEffect(() => {
        if (!conversationId) {
            const all = JSON.parse(localStorage.getItem("all_conversations") || "[]");
            if (all.length > 0) setConversationId(all[all.length - 1].id);
        }
    }, [conversationId, setConversationId]);

    // Reusable fetch function so other actions can refresh messages
    const fetchMessages = useCallback(async () => {
        if (!conversationId) return;
        try {
            const res = await axios.get(`http://localhost:3001/conversations/${conversationId}/messages`);
            setMessages(res.data);
            inputRef.current?.focus();
        } catch (err) {
            console.error(err);
            setMessages([]);
        }
    }, [conversationId]);

    // Ensure conversation exists on server; if not, create it and return the real id
    const ensureConversationExists = async (id) => {
        if (!id) return null;
        try {
            const list = await axios.get("http://localhost:3001/conversations");
            const found = list.data.find(c => String(c.id) === String(id));
            if (found) return id;

            // create and return new id
            const res = await axios.post("http://localhost:3001/conversations", { name: "Nueva conversación" });
            return res.data.id;
        } catch (err) {
            console.error("Error checking/creating conversation:", err);
            return id; // fallback to original id
        }
    };

    // ⚡ Cargar mensajes desde backend
    useEffect(() => {
        if (!conversationId) return;
        fetchMessages();
    }, [fetchMessages, conversationId]);

    // ⚡ Scroll automático al final
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // ⚡ Guardar scroll
    const handleScroll = () => {
        if (scrollRef.current && conversationId) {
            localStorage.setItem(`chat_scroll_${conversationId}`, scrollRef.current.scrollTop);
        }
    };

    // ⚡ Enviar mensaje
    const sendMessage = async () => {
        if (!conversationId) return;
        const text = input.trim();
        if (!text) return;

        const userMsg = { role: "user", content: text };
        setInput("");
        setLoading(true);

        try {
            // Ensure conversation exists on server and get a valid id
            const validId = await ensureConversationExists(conversationId);
            if (String(validId) !== String(conversationId)) setConversationId(validId);

            // Guardar mensaje del usuario en backend and get inserted id
            await axios.post(`http://localhost:3001/conversations/${validId}/messages`, userMsg);

            // Immediately refresh messages from server to ensure persistence and ordering
            await fetchMessages();

            // Llamada a Qwen3 vía proxy
            const aiResponse = await askAI(text);
            const assistantMsg = { role: "assistant", content: aiResponse };

            // Guardar respuesta en backend
            await axios.post(`http://localhost:3001/conversations/${conversationId}/messages`, assistantMsg);

            // Refresh again to include assistant reply
            await fetchMessages();
        } catch (err) {
            console.error(err);

            // If the error is a foreign key constraint (conversation doesn't exist on server),
            // create the conversation on the backend and retry once.
            const msg = err?.response?.data?.error || err.message || "";
            if (/foreign key|CONSTRAINT|referenced/i.test(msg)) {
                try {
                    const res = await axios.post("http://localhost:3001/conversations", { name: "Nueva conversación" });
                    const createdId = res.data.id;
                    setConversationId(createdId);

                    // Retry posting the user message
                    await axios.post(`http://localhost:3001/conversations/${createdId}/messages`, userMsg);
                    await fetchMessages();

                    // call AI and save assistant reply as before
                    const aiResponse = await askAI(text);
                    const assistantMsg = { role: "assistant", content: aiResponse };
                    await axios.post(`http://localhost:3001/conversations/${createdId}/messages`, assistantMsg);
                    await fetchMessages();
                } catch (e) {
                    console.error("Retry after creating conversation failed:", e);
                    setMessages(prev => [...prev, { role: "assistant", content: "❌ Error: no se pudo guardar el mensaje después de crear la conversación" }]);
                }
            } else {
                setMessages(prev => [...prev, { role: "assistant", content: "❌ Error: no se pudo conectar con la IA o backend" }]);
            }
        } finally {
            setLoading(false);
        }
    };

    // ⚡ Nueva conversación
    const startNewConversation = async () => {
        try {
            const res = await axios.post("http://localhost:3001/conversations", { name: "Nueva conversación" });
            const newId = res.data.id;
            setConversationId(newId);
            setMessages([]);
            setInput("");

            // Remove scroll for the new conversation id (not previous)
            localStorage.removeItem(`chat_scroll_${newId}`);

            // Keep a lightweight index of conversations locally so Chat can fallback
            try {
                const all = JSON.parse(localStorage.getItem("all_conversations") || "[]");
                all.push({ id: newId, name: res.data.name || "Nueva conversación" });
                localStorage.setItem("all_conversations", JSON.stringify(all));
            } catch (e) {
                console.warn("Could not update local conversation index", e);
            }

            inputRef.current?.focus();
        } catch (err) {
            console.error(err);
        }
    };

    // ⚡ Enter envía mensaje
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); // evita salto de línea
            sendMessage();
        }
    };

    return (
        <div style={{ padding: "1rem" }}>
            <h1>Chat</h1>

            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Escribe un mensaje..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    style={{ flex: 1, padding: "0.5rem", fontSize: "1rem" }}
                />
                <button onClick={sendMessage} style={{ padding: "0.5rem 1rem" }}>Enviar</button>
                <button onClick={startNewConversation} style={{ padding: "0.5rem 1rem" }}>Nueva conversación</button>
            </div>

            <div
                ref={scrollRef}
                onScroll={handleScroll}
                style={{
                    border: "1px solid #aaa",
                    padding: "1rem",
                    borderRadius: "5px",
                    height: "300px",
                    overflowY: "auto",
                }}
            >
                {messages.length === 0 && <p style={{ opacity: 0.6 }}>Sin mensajes aún...</p>}

                {messages.map((msg, i) => (
                    <p key={i}>
                        <strong>{msg.role === "user" ? "Tú:" : "Qwen3:"}</strong> {msg.content}
                    </p>
                ))}

                {loading && <p><em>Qwen3 está escribiendo...</em></p>}

                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};

export default ChatView;
