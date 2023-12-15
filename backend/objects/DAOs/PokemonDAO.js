const db = require('./DBConnection');
const Pokemon = require('./models/Pokemon');

async function getPokemonByName(name) {
    return db.query('SELECT * FROM pokemon WHERE pkm_name=?', [name]).then(({results}) => {
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
    return db.query('SELECT * FROM pokemon WHERE pkm_id=?', [id]).then(({results}) => {
        const mon = new Pokemon(results[0]);
        if (mon) {
            return mon;
        }
        else {
            throw new Error("Pokemon not found");
        }
    });
}

module.exports = {
    getPokemonByName: getPokemonByName,
    getPokemonById: getPokemonById,
};