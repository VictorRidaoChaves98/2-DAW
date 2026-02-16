import { cargarNotas, guardarNotas } from "../utils/fileManager.js";

export function getAll() {
    return cargarNotas();
}

export function getById(id) {
    const notas = cargarNotas();
    return notas.find(n => n.id == id);
}

export function create(data) {
    const notas = cargarNotas();
    const nueva = { id: Date.now(), ...data };
    notas.push(nueva);
    guardarNotas(notas);
    return nueva;
}

export function update(id, data) {
    const notas = cargarNotas();
    const index = notas.findIndex(n => n.id == id);
    if (index === -1) return null;
    
    notas[index] = { ...notas[index], ...data };
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
