import db from '../DBConnection';
import Game from '../models/Game'

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

export {
    getGameByName, 
    getGameById
};