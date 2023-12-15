const express = require('express');
const cookieParser = require('cookie-parser');
const router = express.Router();
router.use(cookieParser());
router.use(express.json());
const GameDAO = require('../../objects/DAOs/GameDAO');
const { tokenMiddleware } = require('../middleware/tokenMiddleware');


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

module.exports = router;