import express from 'express';

const app = express();
const PORT = process.env.PORT;
const IP_ADDRESS = process.env.IP_ADDRESS;

import routes from './apiRoutes.js';

app.use(express.json());
app.use(routes);

import cookieParser from 'cookie-parser';
app.use(cookieParser());



// As our server to listen for incoming connections
app.listen(PORT, IP_ADDRESS, () => console.log(`Server listening on port: ${PORT}`));