// const userRoutes = require('./routes/userRoutes.js') ;
// const huntRoutes = require('./routes/huntRoutes.js');
// const pokemonRoutes = require('./routes/pokemonRoutes.js');

import userRoutes from './routes/userRoutes.js';
import huntRoutes from './routes/huntRoutes.js';
import pokemonRoutes from './routes/pokemonRoutes.js';

// const express = require('express');
import express from 'express';
const apiRouter = express.Router();

apiRouter.use(userRoutes);
apiRouter.use(huntRoutes);
apiRouter.use(pokemonRoutes);

export default apiRouter;