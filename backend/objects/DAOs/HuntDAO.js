import {query} from '../DBConnection.js';
import User from '../models/User.js';
import Hunt from '../models/Hunt.js';
import Pokemon from '../models/Pokemon.js';

const Pokedex = require("pokeapi-js-wrapper")
const customOptions = {
  protocol: "https",
  hostName: "localhost:443",
  versionPath: "/api/v2/",
  cache: true,
  timeout: 5 * 1000, // 5s
  cacheImages: true
}
const P = new Pokedex.Pokedex(customOptions)

async function getHuntById(id) {
    return query('SELECT * FROM hunt WHERE hnt_id=?', [id]).then(({results}) => {
        const hunt = new Hunt(results[0]);
        if (hunt) {
            return hunt;
        }
        else {
            throw new Error("Hunt not found");
        }
    });
}

async function getHuntsByUser(user_id) {
    return query('SELECT * FROM hunt WHERE usr_id=?', [user_id]).then(({results}) => {
        const hunts = results.map(h => new Hunt(h));
        if (hunts) {
            return hunts;
        }
        else {
            throw new Error("No Hunts Found");
        }
    });
}

async function createNewHunt(user, pokemon, game, method, start_date_string, increment, charm, nickname) {
    return query('INSERT INTO hunt (usr_id, pkm_name, gam_name, mtd_id, hnt_start_date_string, hnt_inc, htn_charm VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
    [user, pokemon, game, method, start_date_string, increment, charm]).then(({results}) => {
        if (results.insertId) {
            return getUserById(results.insertId);
        }
    });
}

async function createNewFinishedHunt(user, pokemon, game, method, start_date_string, end_date_string, count, increment, charm, nickname) {
    return query('INSERT INTO hunt (usr_id, pkm_name, gam_name, mtd_id, hnt_start_date_string, hnt_end_date_string, hnt_count, hnt_inc, htn_charm, hnt_nnm VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
    [user, pokemon, game, method, start_date_string, end_date_string, count, increment, charm, nickname]).then(({results}) => {
        if (results.insertId) {
            return getHuntById(results.insertId);
        }
    });
}
export default {
    getHuntById,
    getHuntsByUser,
    createNewHunt,
    createNewFinishedHunt
};