import express from 'express';
import cookieParser from 'cookie-parser';
const router = express.Router();
router.use(cookieParser());
router.use(express.json());
import PokemonDAO from '../../objects/DAOs/PokemonDAO';
import tokenMiddleware from '../middleware/tokenMiddleware';


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

export default router;