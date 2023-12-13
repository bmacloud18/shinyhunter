const userRoutes = require('./routes/userRoutes.js');
const pokemonRoutes = require('./routes/pokemonRoutes.js');
const huntRoutes = require('./routes/huntRoutes.js');
const gameRoutes = require('./routes/gameRoutes.js');

const express = require('express');
const apiRouter = express.Router();

apiRouter.use(userRoutes);
apiRouter.use(pokemonRoutes);
apiRouter.use(huntRoutes);
apiRouter.use(gameRoutes);

module.exports = apiRouter;