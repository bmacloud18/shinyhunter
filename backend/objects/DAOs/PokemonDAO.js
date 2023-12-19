import {query} from '../DBConnection.js';
import Pokemon from '../models/Pokemon.js';

import Pokedex from 'pokedex-promise-v2';
const P = new Pokedex();

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