import userRoutes from './routes/userRoutes.js';
import pokemonRoutes from './routes/pokemonRoutes.js';
import huntRoutes from './routes/huntRoutes.js';
import gameRoutes from './routes/gameRoutes.js';

import express from 'express';
const apiRouter = express.Router();

apiRouter.use(userRoutes);
apiRouter.use(pokemonRoutes);
apiRouter.use(huntRoutes);
apiRouter.use(gameRoutes);

module.exports = apiRouter;