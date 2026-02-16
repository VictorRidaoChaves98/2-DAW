import * as notasService from "../services/notas.service.js";

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
