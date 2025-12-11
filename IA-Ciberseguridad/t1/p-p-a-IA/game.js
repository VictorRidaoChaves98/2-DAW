// game.js

export function machineMove(history) {
    const moves = ["piedra", "papel", "tijeras"];
    const count = { piedra: 0, papel: 0, tijeras: 0 };

    // Contar cuántas veces jugó cada opción el jugador
    history.player.forEach(move => {
        if (count[move] !== undefined) count[move]++;
    });

    // Jugada más probable del jugador
    let predicted = moves[0];
    if (count.papel > count[predicted]) predicted = "papel";
    if (count.tijeras > count[predicted]) predicted = "tijeras";

    // Jugada de la máquina que vence a la más probable
    const beats = { piedra: "papel", papel: "tijeras", tijeras: "piedra" };
    const nextMove = beats[predicted];

    // Calcular predictibilidad basada en aciertos anteriores
    let aciertos = 0;
    history.player.forEach((p, i) => {
        if (i < history.machine.length) {
            const expected = beats[p];
            if (history.machine[i] === expected) aciertos++;
        }
    });

    const predictability_percentage = history.player.length
        ? (aciertos / history.player.length) * 100
        : 0;

    return {
        next_move: nextMove,
        analysis: {
            predictability_percentage: parseFloat(predictability_percentage.toFixed(1)),
            player_next_move_prediction: predicted,
        },
    };
}
