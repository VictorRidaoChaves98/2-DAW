// src/services/pokeService.js
const API = "https://pokeapi.co/api/v2";

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error ${res.status} for ${url}`);
  return res.json();
}

export async function getPokemonBasic(nameOrId) {
  const data = await fetchJson(`${API}/pokemon/${encodeURIComponent(String(nameOrId).toLowerCase())}`);
  return data;
}

export async function getPokemonDetails(nameOrId) {
  // returns { pokemon, species, evolutions: [names], evolutionDetails: [{name,image}] }
  const pokemon = await getPokemonBasic(nameOrId);

  const species = await fetchJson(pokemon.species.url);

  let evolutions = [];
  try {
    const evoChain = await fetchJson(species.evolution_chain.url);
    // Traverse chain recursively to gather species names in order
    const results = [];
    function traverse(node) {
      if (!node) return;
      if (node.species && node.species.name) results.push(node.species.name);
      if (node.evolves_to && node.evolves_to.length) {
        node.evolves_to.forEach(traverse);
      }
    }
    traverse(evoChain.chain);
    evolutions = results; // array of species names
  } catch (e) {
    // ignore evolution errors, return empty
    evolutions = [];
  }

  // Optionally fetch images for the evolutions (best-effort)
  const evolutionDetails = await Promise.all(
    evolutions.map(async (name) => {
      try {
        const p = await getPokemonBasic(name);
        const img = p.sprites?.other?.['official-artwork']?.front_default || p.sprites?.front_default || null;
        return { name, image: img };
      } catch (e) {
        return { name, image: null };
      }
    })
  );

  return {
    pokemon,
    species,
    evolutions,
    evolutionDetails,
  };
}

export default { getPokemonBasic, getPokemonDetails };
