import * as notasService from "../services/notas.service.js";

export function getAll(req, res) {
    res.json(notasService.getAll());
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
