import fs from "fs";

const file = "./src/data/notas.json";

export function cargarNotas() {
    try {
        const data = fs.readFileSync(file, "utf8");
        return JSON.parse(data);
    } catch {
        return [];
    }
}

export function guardarNotas(notas) {
    fs.writeFileSync(file, JSON.stringify(notas, null, 2));
}
