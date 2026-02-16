// 3: Alterar el valor de una variable y continuar la ejecución

function calcularDescuento(precio, porcentaje) {
    let descuento = precio * (porcentaje / 100);
    let total = precio - descuento;
    return total;
}

let precioProducto = 120;
let porcentajeDescuento = 20;

let totalPagar = calcularDescuento(precioProducto, porcentajeDescuento);

console.log("Total a pagar:", totalPagar);
