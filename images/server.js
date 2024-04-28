const express = require('express');
const routes = require('./imageRoutes.js');

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(routes);


// As our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));