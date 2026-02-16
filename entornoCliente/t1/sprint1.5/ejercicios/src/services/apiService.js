const BASE_URL = "http://localhost:3001";

export const getConversations = async () => {
    const res = await fetch(`${BASE_URL}/conversations`);
    return res.json();
};

export const createConversation = async (name) => {
    const res = await fetch(`${BASE_URL}/conversations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name })
    });
    return res.json();
};

export const getMessages = async (conversationId) => {
    const res = await fetch(`${BASE_URL}/conversations/${conversationId}/messages`);
    return res.json();
};

export const addMessage = async (conversationId, role, content) => {
    const res = await fetch(`${BASE_URL}/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, content })
    });
    return res.json();
};

export const deleteConversation = async (conversationId) => {
    const res = await fetch(`${BASE_URL}/conversations/${conversationId}`, {
        method: "DELETE"
    });
    return res.json();
};
