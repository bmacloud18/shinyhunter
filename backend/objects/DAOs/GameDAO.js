import { version } from 'os';
import {query} from '../DBConnection.js';
import Game from '../models/Game.js'
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

//standard get object by name with custom Game class
async function getGameByName(name) {
    return P.getVersionByName(name).then(({results}) => {
        const game = new Game(results[0]);
        if (game) {
            return game;
        }
        else {
            throw new Error("Game not found");
        }
    });
}

//returns poke api version object given generation string in form generation-x, x in roman numerals (1-9)
async function getGamesByGen(gen) {
    const version_groups = await P.getGenerationByName(gen);
    let games = [];
    let ret = [];
    for (vg in version_groups)
    {
        const versions = await P.getVersionGroupByName(vg).versions;
        games.push(...versions);
    }

    for (g in games)
    {
        ret.push(await P.getVersionByName(g));
    }

    return ret;
}

export default {
    getGameByName, 
    getGameById
};