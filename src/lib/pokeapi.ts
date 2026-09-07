import type { NameEntry, PokemonData } from "../types";

const GEN1_COUNT = 151;
const BASE_URL = "https://pokeapi.co/api/v2";

let gen1NamesCache: NameEntry[] | null = null;
let gen1NamesPromise: Promise<NameEntry[]> | null = null;

const pokemonCache = new Map<number, PokemonData>();

function idFromUrl(url: string): number {
  const match = url.match(/\/pokemon\/(\d+)\/?$/);
  if (!match) throw new Error(`Could not parse Pokémon id from url: ${url}`);
  return Number(match[1]);
}

export async function fetchGen1Names(): Promise<NameEntry[]> {
  if (gen1NamesCache) return gen1NamesCache;
  if (!gen1NamesPromise) {
    gen1NamesPromise = fetch(`${BASE_URL}/pokemon?limit=${GEN1_COUNT}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load Pokémon list (${res.status})`);
        return res.json();
      })
      .then((data: { results: { name: string; url: string }[] }) => {
        const names = data.results.map((r) => ({ id: idFromUrl(r.url), name: r.name }));
        gen1NamesCache = names;
        return names;
      });
  }
  return gen1NamesPromise;
}

export async function fetchPokemon(id: number): Promise<PokemonData> {
  const cached = pokemonCache.get(id);
  if (cached) return cached;

  const res = await fetch(`${BASE_URL}/pokemon/${id}`);
  if (!res.ok) throw new Error(`Failed to load Pokémon #${id} (${res.status})`);
  const data = await res.json();

  const artworkUrl: string =
    data.sprites?.other?.["official-artwork"]?.front_default ?? data.sprites?.front_default;

  const pokemon: PokemonData = { id: data.id, name: data.name, artworkUrl };
  pokemonCache.set(id, pokemon);
  return pokemon;
}

export { GEN1_COUNT };
