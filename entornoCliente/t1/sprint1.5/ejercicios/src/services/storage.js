// src/services/storage.js

const SESSION_KEY = "isLoggedIn";
const SESSION_TIME_KEY = "sessionTime";
const MAX_SESSION_MS = 1000 * 60 * 30; // 30 minutos por ejemplo

export const setSession = (value) => {
    localStorage.setItem(SESSION_KEY, value ? "true" : "false");
    localStorage.setItem(SESSION_TIME_KEY, Date.now().toString());
};

export const getSession = () => {
    const logged = localStorage.getItem(SESSION_KEY) === "true";
    const timestamp = Number(localStorage.getItem(SESSION_TIME_KEY));

    if (!logged || !timestamp) return false;

    const expired = Date.now() - timestamp > MAX_SESSION_MS;

    if (expired) {
        clearSession();
        return false;
    }

    return true;
};

export const clearSession = () => {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_TIME_KEY);
};
