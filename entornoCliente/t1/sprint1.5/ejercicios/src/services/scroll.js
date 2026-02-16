const SCROLL_KEY = "scroll_positions";

export const scrollStore = {
    save(pathname, value) {
        const existing = JSON.parse(localStorage.getItem(SCROLL_KEY) || "{}");
        existing[pathname] = value;
        localStorage.setItem(SCROLL_KEY, JSON.stringify(existing));
    },

    load(pathname) {
        const existing = JSON.parse(localStorage.getItem(SCROLL_KEY) || "{}");
        return existing[pathname] || 0;
    }
};
