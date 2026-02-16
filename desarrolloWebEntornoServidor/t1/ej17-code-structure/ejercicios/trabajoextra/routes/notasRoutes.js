import { verNotas, agregarNota, borrarNota } from "../controllers/notasController.js";

export function ejecutarOpcion(opcion) {
    switch (opcion) {
        case 1: verNotas(); break;
        case 2: agregarNota(); break;
        case 3: borrarNota(); break;
        case 4:
            console.log("Saliendo...");
            process.exit();
        default:
            console.log("Opción inválida.");
    }
}
