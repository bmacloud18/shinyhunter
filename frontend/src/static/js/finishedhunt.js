//script for viewing a completed hunt or another user's active hunt

import api from './APIclient.js';
import header from './header.js';
import getPage from './getPage.js';

const url = window.location.href;

const query = window.location.search;
let parameters = new URLSearchParams(query);
let page_id = parameters.get('id');
const page = getPage(url);

const user = await api.getCurrentUser();
header(user);

const title = document.getElementById('nickname');
const sub = document.getElementById('timeelapsed');
const sprite = document.getElementById('sprite');
const countarea = document.getElementById('count');

const game = document.getElementById('game');
const method = document.getElementById('method');

const start = document.getElementById('startdate');
const end = document.getElementById('enddate');

const reopen = document.getElementById('reopen');

api.getHuntById(page_id).then(async hunt => {
    const pkm = await api.getPokemonByName(hunt.pkm.toLowerCase());
    title.innerText = hunt.nickname;
    sub.innerText = hunt.hunt_time_display;

    const spritelink = document.createElement('img');
    spritelink.alt = 'Shiny Sprite';
    spritelink.src = pkm.sprite;
    sprite.append(spritelink);

    countarea.innerText = hunt.count;

    reopen.addEventListener('click', e => {
        api.updateHunt(hunt.id, hunt.hunt_time, hunt.start_date_string, null, count, hunt.increment, hunt.charm, hunt.nickname).then(hunt => {
            console.log(hunt);
        }).catch(err => {
            throw new Error(err.message);
        });
    });
})