import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

function jsonResponse(body: unknown, ok = true, status = 200) {
  return {
    ok,
    status,
    json: () => Promise.resolve(body),
  } as Response;
}

describe("pokeapi", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("fetches and parses the Gen 1 name list, caching after the first call", async () => {
    const listBody = {
      results: [
        { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
        { name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon/2/" },
      ],
    };
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(listBody));
    vi.stubGlobal("fetch", fetchMock);

    const { fetchGen1Names } = await import("./pokeapi");

    const names = await fetchGen1Names();
    expect(names).toEqual([
      { id: 1, name: "bulbasaur" },
      { id: 2, name: "ivysaur" },
    ]);
    expect(fetchMock).toHaveBeenCalledWith("https://pokeapi.co/api/v2/pokemon?limit=151");

    await fetchGen1Names();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("throws when the name list request fails", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({}, false, 500));
    vi.stubGlobal("fetch", fetchMock);

    const { fetchGen1Names } = await import("./pokeapi");

    await expect(fetchGen1Names()).rejects.toThrow(/Failed to load Pokémon list/);
  });

  it("fetches a Pokémon, preferring official artwork, and caches per id", async () => {
    const pokemonBody = {
      id: 1,
      name: "bulbasaur",
      sprites: {
        front_default: "small.png",
        other: { "official-artwork": { front_default: "artwork.png" } },
      },
    };
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(pokemonBody));
    vi.stubGlobal("fetch", fetchMock);

    const { fetchPokemon } = await import("./pokeapi");

    const pokemon = await fetchPokemon(1);
    expect(pokemon).toEqual({ id: 1, name: "bulbasaur", artworkUrl: "artwork.png" });
    expect(fetchMock).toHaveBeenCalledWith("https://pokeapi.co/api/v2/pokemon/1");

    await fetchPokemon(1);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("falls back to the default sprite when official artwork is missing", async () => {
    const pokemonBody = {
      id: 2,
      name: "ivysaur",
      sprites: { front_default: "small.png", other: {} },
    };
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(pokemonBody));
    vi.stubGlobal("fetch", fetchMock);

    const { fetchPokemon } = await import("./pokeapi");

    const pokemon = await fetchPokemon(2);
    expect(pokemon.artworkUrl).toBe("small.png");
  });

  it("throws when a Pokémon request fails", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({}, false, 404));
    vi.stubGlobal("fetch", fetchMock);

    const { fetchPokemon } = await import("./pokeapi");

    await expect(fetchPokemon(9999)).rejects.toThrow(/Failed to load Pokémon #9999/);
  });
});
