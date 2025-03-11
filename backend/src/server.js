// const express = require('express');

import express from 'express';
import routes from './apiRoutes.js';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.BACKEND_PORT;

// const routes = require('./apiRoutes.js')

app.use(express.json());
app.use(routes);

// const cookieParser = require('cookie-parser');
app.use(cookieParser());



// As our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));