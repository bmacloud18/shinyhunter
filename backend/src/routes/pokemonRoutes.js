const express = require('express');
const cookieParser = require('cookie-parser');
const router = express.Router();
router.use(cookieParser());
router.use(express.json());
const PokemonDAO = require('../../objects/DAOs/PokemonDAO');
const { tokenMiddleware } = require('../middleware/tokenMiddleware');


router.get('/pokemon/:id', tokenMiddleware, (req, res) => {
    const pokemonId = req.params.id;
    PokemonDAO.getPokemonById(pokemonId).then(pokemon => {
        res.json(pokemon);
    });
});

router.get('/pokemon/name/:name', tokenMiddleware, (req, res) => {
    const pokemonName = req.params.name;
    PokemonDAO.getPokemonByName(pokemonName).then(pokemon => {
        res.json(pokemon);
    });
});

module.exports = router;