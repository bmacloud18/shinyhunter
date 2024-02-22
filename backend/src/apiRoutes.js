const userRoutes = require('./routes/userRoutes.js') ;
const huntRoutes = require('./routes/huntRoutes.js');

const express = require('express');
const apiRouter = express.Router();

apiRouter.use(userRoutes);
apiRouter.use(huntRoutes);

module.exports = apiRouter;