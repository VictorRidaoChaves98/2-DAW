// src/components/Views/PokedexView.jsx
import React, { useState, useEffect } from "react";
import Loading from "../Feedback/Loading";
import ErrorBlock from "../Feedback/ErrorBlock";
import { getPokemonDetails } from "../../services/pokeService";

const capitalize = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);

const PokedexView = () => {
    const [pokemonList, setPokemonList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [query, setQuery] = useState("");
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        const fetchPokemon = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20");
                if (!res.ok) throw new Error(`Error en la API: ${res.status}`);
                const data = await res.json();
                setPokemonList(data.results);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPokemon();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query) return;
        setLoading(true);
        setError(null);
        setSelected(null);
        try {
            const details = await getPokemonDetails(query);
            const p = details.pokemon;
            const img = p.sprites?.other?.['official-artwork']?.front_default || p.sprites?.front_default || null;
            const types = p.types?.map(t => t.type.name) || [];
            setSelected({ name: p.name, id: p.id, types, image: img, evolutions: details.evolutionDetails });
        } catch (err) {
            setError(err.message || String(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Pokédex</h1>

            <form onSubmit={handleSearch} style={{ marginBottom: 12, display: 'flex', gap: 8 }}>
                <input placeholder="Buscar por nombre o id" value={query} onChange={e=>setQuery(e.target.value)} style={{ flex: 1, padding: '0.5rem' }} />
                <button type="submit" style={{ padding: '0.5rem 1rem' }}>Buscar</button>
            </form>

            {loading && <Loading message="Cargando Pokémon..." />}

            {error && <ErrorBlock title="Error al cargar la Pokédex" message={error} />}

            {/* "Listado rápido" eliminado a petición del usuario */}

            {selected && (
                <div style={{ marginTop: 16, padding: 12, border: '1px solid #ccc', borderRadius: 8 }}>
                    <h2 style={{ textTransform: 'capitalize' }}>{capitalize(selected.name)} (#{selected.id})</h2>
                    {selected.image && <img src={selected.image} alt={selected.name} style={{ width: 200 }} />}
                    <p><strong>Tipos:</strong> {selected.types.join(', ')}</p>
                    <div>
                        <strong>Evoluciones:</strong>
                        {selected.evolutions && selected.evolutions.length ? (
                            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                                {selected.evolutions.map(ev => (
                                    <div key={ev.name} style={{ textAlign: 'center' }}>
                                        {ev.image ? <img src={ev.image} alt={ev.name} style={{ width: 80 }} /> : <div style={{ width:80, height:80, background:'#eee' }} />}
                                        <div style={{ textTransform: 'capitalize' }}>{ev.name}</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <span> No hay evoluciones conocidas.</span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PokedexView;
