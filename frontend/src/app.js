import express from 'express';
import hbs from 'hbs';

const app = express();
const PORT = process.env.PORT;

// Designate the static folder as serving static resources
app.use(express.static(__dirname + '/static'));
app.use(express.urlencoded({extended: true}));

// configure handlebars
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views/templates');
hbs.registerPartials(__dirname + '/views/partials');

// get and use frontend routes
import frontendRoutes from './frontendRoutes';
app.use(frontendRoutes);

// As our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));