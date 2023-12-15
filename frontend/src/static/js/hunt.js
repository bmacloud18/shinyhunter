import { pokemon } from './getCurrentUser.js';

const title = document.querySelector( 'title' );
const welcomeMsg = `Hunting ${pokemon.name}`;

title.innerText = welcomeMsg;
navTitle.innerText = welcomeMsg;
