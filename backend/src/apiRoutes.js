const userRoutes = require('./routes/userRoutes.js') ;
const huntRoutes = require('./routes/huntRoutes.js');
const pokemonRoutes = require('./routes/pokemonRoutes.js');

const express = require('express');
const apiRouter = express.Router();

apiRouter.use(userRoutes);
apiRouter.use(huntRoutes);
apiRouter.use(pokemonRoutes);

module.exports = apiRouter;