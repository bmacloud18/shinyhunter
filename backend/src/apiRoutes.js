const userRoutes = require( './routers/userRoutes.js' );
const pokemonRoutes = require( './routers/pokemonRoutes.js' );
const huntRoutes = require( './routers/huntRoutes.js' );

const express = require('express');
const apiRouter = express.Router();

apiRouter.use( userRoutes );
apiRouter.use( pokemonRoutes );
apiRouter.use( huntRoutes );

module.exports = apiRouter;