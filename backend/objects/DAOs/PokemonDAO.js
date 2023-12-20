import {query} from '../DBConnection.js';
import Pokemon from '../models/Pokemon.js';

const Pokedex = require("pokeapi-js-wrapper")
const customOptions = {
  protocol: "https",
  hostName: "pokeapi.co",
  versionPath: "/api/v2/",
  cache: true,
  timeout: 5 * 1000, // 5s
  cacheImages: true
}
const P = new Pokedex.Pokedex(customOptions)

async function getPokemonByName(name) {
    return P.getPokemonByName(name).then(({results}) => {
        const mon = new Pokemon(results[0]);
        if (mon) {
            return mon;
        }
        else {
            throw new Error("Pokemon not found");
        }
    });
}

async function getPokemonById(id) {
    return P.getPokemonByName(id).then(({results}) => {
        const mon = new Pokemon(results[0]);
        if (mon) {
            return mon;
        }
        else {
            throw new Error("Pokemon not found");
        }
    });
}

export default {
    getPokemonByName,
    getPokemonById
};