//import for the poke-api client-side js wrapper, imported by the APIClient of this project
const Pokedex = require('pokeapi-js-wrapper');
const customOptions = {
  protocol: "https",
  hostName: "localhost:443",
  versionPath: "/api/v2/",
  cache: true,
  timeout: 5 * 1000, // 5s
  cacheImages: true
}

const pokedex = new Pokedex.Pokedex(customOptions);

const express = require('express');
const cookieParser = require('cookie-parser');
const router = express.Router();
router.use(cookieParser());
router.use(express.json());

//used for one pokemon, i.e. for hunts
function cleanMon(pokemon, species) {
    return {
      id: pokemon.order,
      name: pokemon.name,
      avatar: pokemon.sprites.front_shiny,
      types: getTypes(pokemon),
      games: getGames(species),
      color: species.color.name
    }
}

//used for full pokemon list
function minMon(pokemon) {
    return {
        id: pokemon.order,
        name: pokemon.name,
        avatar: pokemon.sprites.front_shiny,
      }
}

function cleanMons(pokemon) {
    let ret = [];
    for (p in pokemon)
    {
        ret.push(minMon(p));
    }

    return ret;
}

function cleanGame(game) {
    return {
        name: game.name
    }
}

function cleanGames(games) {
    let ret = [];
    for (g in games) 
    {
        ret.push(cleanGame(g));
    }

    return ret;
}

//get a hunt by its id
router.get('/pokemon/name/:name', tokenMiddleware, async (req, res) => {
    const pokemon_obj = await pokedex.getPokemonByName(name);
    const species_obj = await pokedex.getPokemonSpeciesByName(name);

    res.json(cleanMon(pokemon_obj, species_obj));
});

router.get('/pokemon', tokenMiddleware, async (req, res) => {
    const interval = {
        offset: 0,
        limit: 1100,
    }

    pokedex.getPokemonList(interval).then(results => {
        res.json(cleanMons(results.results));
    });
});

router.get('/pokemon/games', tokenMiddleware, (req, res) => {
    const interval = {
        offset: 0,
        limit: 43,
    }

    pokedex.getVersionsList(interval).then(results => {
        res.json(cleanGames(results.results));
    });
});






