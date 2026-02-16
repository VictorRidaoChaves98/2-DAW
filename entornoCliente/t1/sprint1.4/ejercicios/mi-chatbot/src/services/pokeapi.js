// src/services/pokeapi.js
export async function getPokemonData(query) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);
        if (!response.ok) throw new Error('Pokémon no encontrado');

        const data = await response.json();
        return {
            name: capitalizeFirstLetter(data.name),
            number: data.id,
            type: capitalizeFirstLetter(data.types[0].type.name),
            sprite: data.sprites.front_default
        };
    } catch (error) {
        return null; // No se encontró Pokémon
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
