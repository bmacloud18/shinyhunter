const db = require('../DBConnection');
const Game = require('../models/Game');

async function getGameByName(name) {
    return db.query('SELECT * FROM game WHERE gam_name=?', [name]).then(({results}) => {
        const game = new Game(results[0]);
        if (game) {
            return game;
        }
        else {
            throw new Error("Game not found");
        }
    });
}

async function getGameById(id) {
    return db.query('SELECT * FROM game WHERE gam_id=?', [id]).then(({results}) => {
        const game = new Game(results[0]);
        if (game) {
            return game;
        }
        else {
            throw new Error("Game not found");
        }
    });
}
module.exports = {
    getGameByName: getGameByName,
    getGameById: getGameById,
}