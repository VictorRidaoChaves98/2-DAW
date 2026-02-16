// ===============================
// PARTE 1: Buscar Pokémon
// ===============================
async function buscarPokemon() {
    const nombre = document.getElementById("pokemonInput").value.trim().toLowerCase();
    const div = document.getElementById("pokemonInfo");

    if (!nombre) {
        div.innerHTML = `<p style="color:red;">⚠️ Ingresa un nombre.</p>`;
        return;
    }

    div.innerHTML = "⏳ Buscando...";

    try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombre}`);
        if (!res.ok) throw new Error("Pokémon no encontrado");

        const data = await res.json();
        div.innerHTML = `
      <h3>${data.name.toUpperCase()} (ID: ${data.id})</h3>
      <img src="${data.sprites.other["official-artwork"].front_default}" width="150">
      <p><strong>Tipos:</strong> ${data.types.map(t => t.type.name).join(", ")}</p>
    `;
    } catch (error) {
        div.innerHTML = `<p style="color:red;">⚠️ ${error.message}</p>`;
    }
}

// ===============================
// PARTE 2: Comparar Pokémon
// ===============================
async function compararPokemon() {
    const nombre1 = document.getElementById("pokemon1").value.trim().toLowerCase();
    const nombre2 = document.getElementById("pokemon2").value.trim().toLowerCase();
    const div = document.getElementById("comparativa");

    if (!nombre1 || !nombre2) {
        div.innerHTML = `<p style="color:red;">⚠️ Introduce ambos Pokémon.</p>`;
        return;
    }

    div.innerHTML = "⏳ Comparando...";

    try {
        const [poke1, poke2] = await Promise.all([
            fetch(`https://pokeapi.co/api/v2/pokemon/${nombre1}`).then(r => r.json()),
            fetch(`https://pokeapi.co/api/v2/pokemon/${nombre2}`).then(r => r.json())
        ]);

        const stats1 = poke1.stats.map(s => s.base_stat);
        const stats2 = poke2.stats.map(s => s.base_stat);
        const nombresStats = poke1.stats.map(s => s.stat.name);
        const total1 = stats1.reduce((a, b) => a + b, 0);
        const total2 = stats2.reduce((a, b) => a + b, 0);
        const ganador = total1 > total2 ? poke1.name : total2 > total1 ? poke2.name : "Empate";

        div.innerHTML = `
      <div style="display:flex; flex-direction:column; align-items:center; gap:20px;">
        <div style="display:flex; align-items:center; gap:40px; justify-content:center;">
          <img src="${poke1.sprites.other["official-artwork"].front_default}" width="150">
          
          <div>
            <h2 style="text-align:center;">⚔️ ${poke1.name.toUpperCase()} vs ${poke2.name.toUpperCase()}</h2>
            <table>
              <tr><th>Estadística</th><th>${poke1.name}</th><th>${poke2.name}</th></tr>
              ${nombresStats.map((stat, i) => `
                <tr>
                  <td>${stat}</td>
                  <td>${stats1[i]}</td>
                  <td>${stats2[i]}</td>
                </tr>`).join("")}
              <tr style="font-weight:bold; background:#f4f4f4;">
                <td>Total</td>
                <td>${total1}</td>
                <td>${total2}</td>
              </tr>
            </table>
          </div>

          <img src="${poke2.sprites.other["official-artwork"].front_default}" width="150">
        </div>

        <p><strong>🏆 Ganador:</strong> ${ganador.toUpperCase()}</p>
      </div>
    `;
    } catch {
        div.innerHTML = `<p style="color:red;">⚠️ Pokémon no encontrado.</p>`;
    }
}

// ===============================
// PARTE 3: Cadena Evolutiva Horizontal
// ===============================
async function obtenerCadenaEvolutiva(nombre) {
    try {
        const poke = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombre}`);
        if (!poke.ok) throw new Error("Pokémon no encontrado");
        const pokeData = await poke.json();

        const especie = await fetch(pokeData.species.url);
        const especieData = await especie.json();

        const cadena = await fetch(especieData.evolution_chain.url);
        const cadenaData = await cadena.json();

        let evoluciones = [];
        let actual = cadenaData.chain;

        while (actual) {
            evoluciones.push(actual.species.name);
            actual = actual.evolves_to[0];
        }

        const result = [];
        for (let nombre of evoluciones) {
            const r = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombre}`);
            const d = await r.json();
            result.push({
                nombre: nombre,
                imagen: d.sprites.other["official-artwork"].front_default,
                habilidades: d.abilities.map(a => a.ability.name)
            });
        }

        return result;
    } catch (error) {
        return { error: error.message };
    }
}

async function mostrarCadenaEvolutiva() {
    const nombre = document.getElementById("pokemonEvolucion").value.trim().toLowerCase();
    const div = document.getElementById("evolucion");

    if (!nombre) {
        div.innerHTML = `<p style="color:red;">⚠️ Escribe un nombre de Pokémon.</p>`;
        return;
    }

    div.innerHTML = "⏳ Cargando...";

    const data = await obtenerCadenaEvolutiva(nombre);

    if (data.error) {
        div.innerHTML = `<p style="color:red;">⚠️ ${data.error}</p>`;
        return;
    }

    if (data.length === 1) {
        div.innerHTML = `<p>ℹ️ ${data[0].nombre.toUpperCase()} no tiene evoluciones.</p>`;
        return;
    }

    div.innerHTML = `
    <h3 style="text-align:center;">🧬 Evolución de ${nombre.toUpperCase()}</h3>
    <div class="evolucion-container">
      ${data.map(p => `
        <div class="evolucion-card">
          <h4>${p.nombre.toUpperCase()}</h4>
          <img src="${p.imagen}" width="120">
          <p><strong>Habilidades:</strong> ${p.habilidades.join(", ")}</p>
        </div>
      `).join("")}
    </div>
  `;
}
