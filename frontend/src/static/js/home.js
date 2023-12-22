import {user} from './getCurrentUser.js';

const title = document.querySelector('title');
const welcomeMsg = `Welcome ${user.first_name} ${user.last_name}!`;

title.innerText = welcomeMsg;
navTitle.innerText = welcomeMsg;
