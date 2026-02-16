import * as notasService from "../services/notas.service.js";
import archiver from "archiver";

const sanitize = (s) => String(s || "").replace(/[^a-z0-9\-_.]/gi, "_").slice(0, 200) || "nota";

export function getAll(req, res) {
    const q = req.query || {};
    // If no query parameters, keep previous behaviour (return raw array)
    if (Object.keys(q).length === 0) return res.json(notasService.getAll());

    const options = {
        filterTitle: q.title || q.filterTitle,
        filterContent: q.content || q.filterContent,
        category: q.category,
        group: q.group || q.grupo,
        fromDate: q.from || q.fromDate,
        toDate: q.to || q.toDate,
        sortBy: q.sortBy || q.sort || q.sort_by,
        order: q.order,
        page: q.page,
        perPage: q.perPage || q.per_page,
    };

    const result = notasService.getAll(options);
    res.json(result);
}

export function getById(req, res) {
    const nota = notasService.getById(req.params.id);
    if (!nota) return res.status(404).json({ error: "Nota no encontrada" });
    res.json(nota);
}

export function create(req, res) {
    const nueva = notasService.create(req.body);
    res.status(201).json(nueva);
}

export function update(req, res) {
    const nota = notasService.update(req.params.id, req.body);
    if (!nota) return res.status(404).json({ error: "Nota no encontrada" });
    res.json(nota);
}

export function remove(req, res) {
    const ok = notasService.remove(req.params.id);
    if (!ok) return res.status(404).json({ error: "Nota no encontrada" });
    res.status(204).send();
}

// Importar uno o varios ficheros .note (se espera que multer ponga los archivos en req.files)
export async function importNotes(req, res) {
    const files = req.files || [];
    if (!files.length) return res.status(400).json({ error: "No se han enviado ficheros" });

    const created = [];
    for (const f of files) {
        const name = f.originalname || "archivo.note";
        if (!name.toLowerCase().endsWith(".note")) continue; // ignore non .note files
        const text = f.buffer ? f.buffer.toString("utf8") : "";

        let payload = null;
        try {
            payload = JSON.parse(text);
        } catch (e) {
            // treat as plain text content
            payload = { titulo: name.replace(/\.note$/i, ""), contenido: text };
        }

        // Create note via service (service will attach id and timestamps)
        const nueva = notasService.create(payload);
        created.push(nueva);
    }

    if (!created.length) return res.status(400).json({ error: "No se han importado ficheros .note válidos" });
    res.status(201).json({ imported: created.length, notas: created });
}

// Exportar notas que cumplan filtros. Si una sola nota -> descarga .note, si varias -> zip
export async function exportNotes(req, res) {
    const q = req.query || {};
    const options = Object.keys(q).length === 0 ? null : {
        filterTitle: q.title || q.filterTitle,
        filterContent: q.content || q.filterContent,
        category: q.category,
        group: q.group || q.grupo,
        fromDate: q.from || q.fromDate,
        toDate: q.to || q.toDate,
        sortBy: q.sortBy || q.sort || q.sort_by,
        order: q.order,
        page: q.page,
        perPage: q.perPage || q.per_page,
    };

    const result = notasService.getAll(options);
    // result can be array (old behavior) or object with items
    const items = Array.isArray(result) ? result : (result.items || []);
    if (!items.length) return res.status(404).json({ error: "No hay notas para exportar" });

    if (items.length === 1) {
        const note = items[0];
        const filename = sanitize(note.titulo) || `nota_${note.id || Date.now()}`;
        const content = JSON.stringify(note, null, 2);
        res.setHeader("Content-Type", "application/octet-stream");
        res.setHeader("Content-Disposition", `attachment; filename="${filename}.note"`);
        return res.send(content);
    }

    // multiple -> zip
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", `attachment; filename="notas_export.zip"`);

    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.on("error", err => {
        console.error("Archiver error:", err);
        if (!res.headersSent) res.status(500).end();
    });
    archive.pipe(res);

    for (const note of items) {
        const fname = `${sanitize(note.titulo) || `nota_${note.id || Date.now()}`}.note`;
        const data = JSON.stringify(note, null, 2);
        archive.append(data, { name: fname });
    }

    await archive.finalize();
}
