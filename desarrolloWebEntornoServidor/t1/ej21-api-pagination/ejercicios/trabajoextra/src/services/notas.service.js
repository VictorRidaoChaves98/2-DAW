import { cargarNotas, guardarNotas } from "../utils/fileManager.js";

// Default page size can be overridden via env var; keeps backward compatibility if not set
const DEFAULT_PER_PAGE = Number(process.env.NOTAS_PER_PAGE_DEFAULT) || 10;

const parseDate = (value) => {
    if (value === undefined || value === null || value === "") return null;
    const numeric = Number(value);
    if (!Number.isNaN(numeric)) return numeric;
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? null : parsed;
};

const asTimestamp = (dateLike, fallback = 0) => {
    if (!dateLike) return fallback;
    const ts = parseDate(dateLike);
    return ts ?? fallback;
};

const noteSize = (note) => ((note.titulo || "").length + (note.contenido || "").length);

export function getAll(options) {
    const notas = cargarNotas();
    // If no options provided, preserve previous behaviour and return raw array
    if (!options || Object.keys(options).length === 0) return notas;

    // Normalize notes to objects so filtering/sorting is simpler
    let items = notas.map((n, idx) => {
        if (typeof n === "string") {
            return { id: idx + 1, titulo: n, contenido: "", createdAt: null, updatedAt: null, categoria: null };
        }
        return { ...n };
    });

    const {
        filterTitle,
        filterContent,
        category,
        group,
        fromDate,
        toDate,
        sortBy,
        order = "asc",
        page = 1,
        perPage = DEFAULT_PER_PAGE,
    } = options;

    // Filtering
    if (filterTitle) {
        const t = String(filterTitle).toLowerCase();
        items = items.filter(i => (i.titulo || "").toLowerCase().includes(t));
    }

    if (filterContent) {
        const t = String(filterContent).toLowerCase();
        items = items.filter(i => (i.contenido || "").toLowerCase().includes(t));
    }

    if (category || group) {
        const target = category ?? group;
        items = items.filter(i => i.categoria == target || i.grupo == target);
    }

    // Date range filtering (created or updated date qualifies)
    const fromTs = parseDate(fromDate);
    const toTs = parseDate(toDate);

    if (fromTs !== null || toTs !== null) {
        items = items.filter(i => {
            const createdTs = asTimestamp(i.createdAt, typeof i.id === "number" ? i.id : 0);
            const updatedTs = asTimestamp(i.updatedAt, createdTs);
            // A note is included if either creation or last update falls within the range
            const candidates = [createdTs, updatedTs].filter(Boolean);
            if (!candidates.length) return false;

            const withinRange = candidates.some(ts => {
                if (fromTs !== null && ts < fromTs) return false;
                if (toTs !== null && ts > toTs) return false;
                return true;
            });
            return withinRange;
        });
    }

    // Sorting
    if (sortBy) {
        const dir = String(order).toLowerCase() === "desc" ? -1 : 1;
        const key = String(sortBy).toLowerCase();
        let comparator = null;

        if (["date", "created", "createdat", "creacion", "fecha"].includes(key)) {
            comparator = (a, b) => (asTimestamp(a.createdAt, typeof a.id === "number" ? a.id : 0) - asTimestamp(b.createdAt, typeof b.id === "number" ? b.id : 0)) * dir;
        } else if (["updated", "updatedat", "edicion", "modificacion", "modified"].includes(key)) {
            comparator = (a, b) => (asTimestamp(a.updatedAt, asTimestamp(a.createdAt, 0)) - asTimestamp(b.updatedAt, asTimestamp(b.createdAt, 0))) * dir;
        } else if (["titulo", "title", "nombre"].includes(key)) {
            comparator = (a, b) => (a.titulo || "").localeCompare(b.titulo || "") * dir;
        } else if (key === "size" || key === "tamano") {
            comparator = (a, b) => (noteSize(a) - noteSize(b)) * dir;
        }

        if (comparator) items.sort((a, b) => comparator(a, b));
    }

    // Pagination
    const p = Math.max(parseInt(page, 10) || 1, 1);
    const pp = Math.max(parseInt(perPage, 10) || DEFAULT_PER_PAGE, 1);
    const totalItems = items.length;
    const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / pp);
    const start = (p - 1) * pp;
    const paged = items.slice(start, start + pp);

    return {
        items: paged,
        totalItems,
        totalPages,
        page: p,
        perPage: pp,
    };
}

export function getById(id) {
    const notas = cargarNotas();
    return notas.find(n => n.id == id);
}

export function create(data) {
    const notas = cargarNotas();
    const now = Date.now();
    const nueva = { id: now, createdAt: now, updatedAt: now, ...data };
    notas.push(nueva);
    guardarNotas(notas);
    return nueva;
}

export function update(id, data) {
    const notas = cargarNotas();
    const index = notas.findIndex(n => n.id == id);
    if (index === -1) return null;
    const now = Date.now();
    notas[index] = { ...notas[index], ...data, updatedAt: now };
    guardarNotas(notas);
    return notas[index];
}

export function remove(id) {
    const notas = cargarNotas();
    const nuevas = notas.filter(n => n.id != id);
    if (nuevas.length === notas.length) return false;

    guardarNotas(nuevas);
    return true;
}
