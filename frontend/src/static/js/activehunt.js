// script for active hunt page (user is actively hunting)

import api from './APIclient.js';
import header from './header.js';
import getPage from './getPage.js';

import Timer from "./easytimer.js/src/easytimer/easytimer.js";

const url = window.location.href;

const query = window.location.search;
const parameters = new URLSearchParams(query);
const page_id = parameters.get('id');
const page = getPage(url);

const user = await api.getCurrentUser();
header(user);

const title = document.getElementById('nickname');
const sub = document.getElementById('timeelapsed');
const sprite = document.getElementById('sprite');
const countarea = document.getElementById('count');

const overlay = document.getElementById('overlay');
const main = document.getElementById('mainarea');

api.getHuntById(page_id).then(async hunt => {
    const pkm = await api.getPokemonByName(hunt.pkm.toLowerCase());
    title.innerText = hunt.nickname;

    sub.innerText = hunt.hunt_time_display;
    const timer = new Timer({
        precision: 'seconds',
        startValues: {
            seconds: parseInt(hunt.hunt_time)
        }
    });
    console.log(hunt.hunt_time);
    timer.start();
    timer.addEventListener('secondsUpdated', function (e) {
        sub.innerText = timer.getTimeValues().toString();
    });
    
    const spritelink = document.createElement('img');
    spritelink.alt = 'Shiny Sprite';
    spritelink.src = pkm.sprite;
    sprite.append(spritelink);

    countarea.innerText = hunt.count;
});

function pause(timer) {
    timer.pause();
    main.style.display = 'none';
    overlay.style.display = 'block'
};

function resume(timer) {
    // timer.start();
    main.style.display = 'block';
    overlay.style.display = 'none'
};
