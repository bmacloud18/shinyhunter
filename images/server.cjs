const express = require('express');
const routes = require('./imageRoutes.cjs');

const app = express();
const PORT = process.env.IMAGES_PORT;

app.use(express.json());
app.use(routes);


// As our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));