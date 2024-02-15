import userRoutes from './routes/userRoutes.js';
import huntRoutes from './routes/huntRoutes.js';

import express from 'express';
const apiRouter = express.Router();

apiRouter.use(userRoutes);
apiRouter.use(huntRoutes);

export default apiRouter;