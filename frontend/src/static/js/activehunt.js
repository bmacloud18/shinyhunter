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

const body = document.getElementById('huntarea');
const overlay = document.getElementById('overlay');
const main = document.getElementById('mainarea');

let active = false;
let seconds = 0;



api.getHuntById(page_id).then(async hunt => {
    const pkm = await api.getPokemonByName(hunt.pkm.toLowerCase());
    title.innerText = hunt.nickname;
    sub.innerText = hunt.hunt_time_display;

    let timer = new Timer({callback: function (e) {
        seconds++;
        const newtime = hunt.hunt_time + seconds;
        sub.innerText = convertTime(newtime);
    }, precision: 'seconds'});

    const spritelink = document.createElement('img');
    spritelink.alt = 'Shiny Sprite';
    spritelink.src = pkm.sprite;
    sprite.append(spritelink);
    sprite.addEventListener('click', e => {
        if (active)
            pause(timer);
        else {
            resume(timer);
        }
    })

    countarea.innerText = hunt.count;
});

function pause(timer) {
    active = false;
    timer.pause();
    main.style.display = 'none';
    overlay.style.display = 'flex'
};

function resume(timer) {
    active = true;
    timer.start();
    main.style.display = 'flex';
    overlay.style.display = 'none'
};

function convertTime(s) {
    // Ensure the input is a non-negative number
    if (!Number.isFinite(s) || s < 0) {
        return 'Invalid input';
    }

    // Calculate hours, minutes, and seconds
    const hours = Math.floor(s / 3600);
    const minutes = Math.floor((s % 3600) / 60);
    const seconds = s % 60;

    // Construct the formatted string
    const formattedTime = [];

    if (hours > 0) {
        formattedTime.push(`${hours}`);
    }

    if (minutes > 0) {
        formattedTime.push(`${minutes}`);
    }

    if (seconds > 0 || (hours === 0 && minutes === 0)) {
        formattedTime.push(`${seconds}`);
    }

    return formattedTime.join(':');
};