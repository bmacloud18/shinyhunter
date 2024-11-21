import userRoutes from './routes/userRoutes.js';
import * as huntRoutes from './routes/huntRoutes.js';
import pokemonRoutes from './routes/pokemonRoutes.js';
import methodRoutes from './routes/methodRoutes.js';

import express from 'express';
const apiRouter = express.Router();

apiRouter.use(userRoutes);
apiRouter.use(huntRoutes.router);
apiRouter.use(huntRoutes.updateRouter);
apiRouter.use(pokemonRoutes);
apiRouter.use(methodRoutes);


export default apiRouter;