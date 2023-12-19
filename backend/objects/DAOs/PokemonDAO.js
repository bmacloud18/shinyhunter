import {query} from '../DBConnection.js';
import Pokemon from '../models/Pokemon.js';

async function getPokemonByName(name) {
    return query('SELECT * FROM pokemon WHERE pkm_name=?', [name]).then(({results}) => {
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
    return query('SELECT * FROM pokemon WHERE pkm_id=?', [id]).then(({results}) => {
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