import express from 'express';
import hbs from 'hbs';

const app = express();
const PORT = process.env.PORT;
const IP_ADDRESS = process.env.IP_ADDRESS;

import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Designate the static folder as serving static resources
app.use(express.static(__dirname + '/static'));
app.use(express.urlencoded({extended: true}));

// configure handlebars
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views/templates');
hbs.registerPartials(__dirname + '/views/partials');

// get and use frontend routes
import frontendRoutes from './frontendRoutes.js';
app.use(frontendRoutes);

// As our server to listen for incoming connections
app.listen(PORT, IP_ADDRESS, () => console.log(`Server listening on port: ${PORT}`));