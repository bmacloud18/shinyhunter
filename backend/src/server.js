import express from 'express';

const app = express();
const PORT = 80;

import routes from './apiRoutes';

app.use(express.json());
app.use(routes);

import cookieParser from 'cookie-parser';
app.use(cookieParser());



// As our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));