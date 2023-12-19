import {query} from '../DBConnection.js';
import Game from '../models/Game.js'

async function getGameByName(name) {
    return query('SELECT * FROM game WHERE gam_name=?', [name]).then(({results}) => {
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
    return query('SELECT * FROM game WHERE gam_id=?', [id]).then(({results}) => {
        const game = new Game(results[0]);
        if (game) {
            return game;
        }
        else {
            throw new Error("Game not found");
        }
    });
}

export default {
    getGameByName, 
    getGameById
};