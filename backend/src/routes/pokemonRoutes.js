//import for the poke-api client-side js wrapper, imported by the APIClient of this project
import Pokedex from 'pokedex-promise-v2';
const customOptions = {
  cache: true,
  timeout: 5 * 1000, // 5s
  cacheImages: true
}

const pokedex = new Pokedex(customOptions);

import express from 'express';
import cookieParser from 'cookie-parser';
import {tokenMiddleware} from '../middleware/tokenMiddleware.js';

const router = express.Router();
router.use(cookieParser());
router.use(express.json());

function getGames(pokemon) {
    let ret = [];
    pokemon.game_indices.forEach(g => {
        ret.push(g.version.name);
    });
    return ret;
}

//cleans up the types array from PokeAPI
function getTypes(pokemon) {
    let ret = [];
    pokemon.types.forEach(t => {
        ret.push(t.type.name);
    });
    return ret;
}

//used for one pokemon, i.e. for hunts
function cleanMon(pokemon, species) {
    return {
      id: pokemon.order,
      name: pokemon.name,
      sprite: pokemon.sprites.front_shiny,
      types: getTypes(pokemon),
      games: getGames(pokemon),
      color: species.color.name
    }
}

//used for full pokemon list
function minMon(pokemon) {
    const n = pokemon.url.length;
    const pre = 34;
    const id = pokemon.url.slice(pre, n-1);
    
    const sprite = "/images/sprites/" + id + ".png"
    return {
        id: id,
        name: pokemon.name,
        sprite: sprite
      }
}

function cleanMons(pokemon) {
    let ret = [];
    pokemon.forEach(p => {
        ret.push(minMon(p));
    });
    return ret;
}

// function cleanGame(game) {
//     return {
//         name: game.name
//     }
// }

// function cleanGames(games) {
//     let ret = [];
//     games.forEach(g => {
//         ret.push(cleanGame(g));
//     });
//     return ret;
// }

//get a hunt by its id
router.get('/pokemon/name/:name', tokenMiddleware, async (req, res) => {
    const name = req.params.name;

    const pokemon_obj = await pokedex.getPokemonByName(name);
    const parts = name.split('-');
    const species_obj = await pokedex.getPokemonSpeciesByName(parts[0]);

    res.json(cleanMon(pokemon_obj, species_obj));
});

router.get('/pokemon', tokenMiddleware, async (req, res) => {
    const interval = {
        offset: 0,
        limit: 100,
    }

    pokedex.getPokemonsList(interval).then(results => {
        res.json(cleanMons(results.results));
    });
});

router.get('/pokemon/games', tokenMiddleware, (req, res) => {
    const interval = {
        offset: 0,
        limit: 43,
    }

    pokedex.getVersionsList(interval).then(results => {
        res.json(results.results);
    });
});

export default router;






