import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loading from "../Feedback/Loading";
import ErrorBlock from "../Feedback/ErrorBlock";

const ConversationsView = ({ conversationId, setConversationId }) => {
    const scrollRef = useRef(null);
    const [conversations, setConversations] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(null);
    const [isDuplicating, setIsDuplicating] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchConversations = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get("http://localhost:3001/conversations");
            // Ensure numeric ordering by id (ascending)
            const sorted = res.data.slice().sort((a, b) => Number(a.id) - Number(b.id));
            setConversations(sorted);
        } catch (err) {
            console.error(err);
            setError(err.message || "Error al cargar conversaciones");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // call fetchConversations asynchronously to avoid synchronous setState in effect body
        (async () => { await fetchConversations(); })();
        const savedScroll = sessionStorage.getItem("conversationsScroll");
        if (savedScroll && scrollRef.current) {
            scrollRef.current.scrollTop = Number(savedScroll);
        }
        // Save scroll when visibility changes or before unload to preserve position
        const saveScroll = () => {
            if (scrollRef.current) sessionStorage.setItem("conversationsScroll", scrollRef.current.scrollTop);
        };

        const handleVisibility = () => {
            if (document.visibilityState === "hidden") saveScroll();
        };

        window.addEventListener("visibilitychange", handleVisibility);
        window.addEventListener("beforeunload", saveScroll);

        return () => {
            // Save scroll on unmount so navigation between routes preserves position
            saveScroll();
            window.removeEventListener("visibilitychange", handleVisibility);
            window.removeEventListener("beforeunload", saveScroll);
        };
    }, []);

    const handleScroll = () => {
        if (scrollRef.current) {
            sessionStorage.setItem("conversationsScroll", scrollRef.current.scrollTop);
        }
    };

    const showConversation = (id) => {
        setConversationId(id);
        navigate("/"); // volver al chat
    };

    const deleteConversationConfirmed = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/conversations/${id}`);
            // If the deleted conversation was active, clear selection and navigate predictably
            if (String(id) === String(conversationId)) {
                setConversationId(null);
                navigate("/conversaciones");
            }
            fetchConversations();
        } catch (err) {
            console.error(err);
        } finally {
            setShowDeleteModal(null);
        }
    };

    const promptDelete = (id) => {
        setShowDeleteModal(id);
    };

    const duplicateConversation = async (id) => {
        setIsDuplicating(true);
        try {
            // fetch messages of the source conversation
            const res = await axios.get(`http://localhost:3001/conversations/${id}/messages`);
            const msgs = res.data || [];

            // create new conversation
            const create = await axios.post("http://localhost:3001/conversations", { name: `Copia de ${id}` });
            const newId = create.data.id;

            // post messages sequentially to preserve order
            for (const m of msgs) {
                await axios.post(`http://localhost:3001/conversations/${newId}/messages`, { role: m.role, content: m.content });
            }

            // navigate to the new conversation
            setConversationId(newId);
            navigate("/");
        } catch (err) {
            console.error("Error duplicando conversación", err);
        } finally {
            setIsDuplicating(false);
        }
    };

    return (
        <div style={{ padding: "1rem" }}>
            <h1>Conversaciones</h1>
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                style={{
                    height: "400px",
                    overflowY: "auto",
                    border: "1px solid #ccc",
                    padding: "0.5rem",
                    backgroundColor: "#f9f9f9"
                }}
            >
                {loading && <Loading message="Cargando conversaciones..." />}

                {error && <ErrorBlock title="Error" message={error} />}

                {!loading && !error && conversations.length === 0 && <p>No hay conversaciones guardadas.</p>}

                {!loading && !error && conversations.map((conv) => (
                    <div
                        key={conv.id}
                        style={{
                            padding: "0.5rem",
                            marginBottom: "0.5rem",
                            borderRadius: "5px",
                            backgroundColor: "#2da1b0ff",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}
                    >
                        <span><strong>{conv.name}</strong></span>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                            <button onClick={() => showConversation(conv.id)}>Mostrar</button>
                            <button onClick={() => duplicateConversation(conv.id)} disabled={isDuplicating}>
                                {isDuplicating ? 'Duplicando...' : 'Duplicar'}
                            </button>
                            <button onClick={() => promptDelete(conv.id)}>Eliminar</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Confirmación modal simple */}
            {showDeleteModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: '#674242ff', padding: 20, borderRadius: 8, width: 360 }}>
                        <h3>Confirmar eliminación</h3>
                        <p>¿Quieres eliminar la conversación {showDeleteModal}? Esta acción es irreversible.</p>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
                            <button onClick={() => setShowDeleteModal(null)}>Cancelar</button>
                            <button onClick={() => deleteConversationConfirmed(showDeleteModal)}>Eliminar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConversationsView;
