import express from 'express';
import cookieParser from 'cookie-parser';
const router = express.Router();
router.use(cookieParser());
router.use(express.json());
import GameDAO from '../../objects/DAOs/GameDAO';
import tokenMiddleware from '../middleware/tokenMiddleware';


router.get('/game/:id', tokenMiddleware, (req, res) => {
    const gameId = req.params.id;
    GameDAO.getGameById(gameId).then(game => {
        res.json(game);
    });
});

router.get('/game/name/:name', tokenMiddleware, (req, res) => {
    const gameName = req.params.name;
    GameDAO.getGameByName(gameName).then(game => {
        res.json(game);
    });
});

export default router;