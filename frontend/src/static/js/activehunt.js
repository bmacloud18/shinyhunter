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

const plus = document.getElementById('plus');
const minus = document.getElementById('minus');

const settings = document.getElementById('settings');
const capture = document.getElementById('capture');

let active = false;
let seconds = 0;
let count;
let diff = 0;

function saveDataToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function getDataFromLocalStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

function saveTimeDataLocally(key) {
    const data = {
        elapsedTime: seconds,
        isRunning: active
    };
    saveDataToLocalStorage(key, data);
}

function saveDataLocallyAndIncrement(key, data) {
    saveDataToLocalStorage(key, data);
    count++;
    diff++;
}

function saveDataLocallyAndDeccrement(key, data) {
    saveDataToLocalStorage(key, data);
    count--;
    diff--;
}


api.getHuntById(page_id).then(async hunt => {
    saveDataToLocalStorage('hunt', hunt);
    const pkm = await api.getPokemonByName(hunt.pkm.toLowerCase());
    title.innerText = hunt.nickname;
    sub.innerText = convertTime(hunt.hunt_time);

    const stopwatchData = getDataFromLocalStorage('stopwatchData');
    const counterData = getDataFromLocalStorage('counterData');

    const hunt_time = hunt.hunt_time;

    if (stopwatchData) {
        hunt_time += stopwatchData.elapsedTime;
        if (stopwatchData.isRunning) {
            resume();
        }
        else {
            pause();
        }
    }

    let timer = new Timer({callback: function (e) {
        seconds++;
        const newtime = hunt_time + seconds;
        sub.innerText = convertTime(newtime);
        saveTimeDataLocally('stopwatchData');
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

    count = hunt.count;

    if (counterData) {
        count = counterData.counter;
    }

    countarea.innerText = count;
    plus.addEventListener('click', e => {
        saveDataLocallyAndIncrement('counterData', { counter: count });
        countarea.innerText = count;
    });

    minus.addEventListener('click', e => {
        saveDataLocallyAndDecrement('counterData', { counter: count });
        countarea.innerText = count;
    });

    settings.addEventListener('click', e => {
        document.location = './huntsettings?id=' + page_id;
        pause(); 
    });

    capture.addEventListener('click', e => {
        const end_date = new Date().toISOString();
        
        api.updateHunt(hunt.id, hunt.hunt_time + seconds, hunt.start_date_string, end_date, count, hunt.increment, hunt.charm, hunt.nickname).then(hunt => {
            console.log(hunt);
        }).catch(err => {
            throw new Error(err.message);
        });
        // document.location = './success'
        // document.location = './finishedhunt?id=' + page_id;
        // document.location = './userprofile?id=' + user.id;
    });
});

function pause(timer) {
    active = false;
    timer.pause();
    main.style.display = 'none';
    overlay.style.display = 'flex'
};

function resume(timer) {
    if (!active) {
        active = true;
        timer.start();
        main.style.display = 'flex';
        overlay.style.display = 'none'
    }
};


// timer library not working correctly with start values, so need to calculate here
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
        if (hours < 10) {
            formattedTime.push(`0${hours}`);
        }
        else {
            formattedTime.push(`${hours}`);
        }
    }
    else {
        formattedTime.push('00');
    }

    if (minutes > 0) {
        if (minutes < 10) {
            formattedTime.push(`0${minutes}`);
        }
        else {
            formattedTime.push(`${minutes}`);
        }
    }
    else {
        formattedTime.push('00');
    }

    if (seconds > 0 || (hours === 0 && minutes === 0)) {
        if (seconds < 10) {
            formattedTime.push(`0${seconds}`);
        }
        else {
            formattedTime.push(`${seconds}`);
        }
    }
    else {
        formattedTime.push('00');
    }

    return formattedTime.join(':');
};

// Save stopwatch data and increment counter on window unload event
window.onunload = function() {
    if (diff > 0 || seconds > 3 && navigator.onLine) {
        const hunt = getDataFromLocalStorage('hunt');
        const stopwatch = getDataFromLocalStorage('stopwatchData');
        const counter = getDataFromLocalStorage('counterData');
    
        const newtime = hunt.hunt_time + stopwatch.elapsedTime;
        const count = counter.counter;
        api.updateHunt(hunt.id, hunt.start_date, newtime, count, hunt.increment, hunt.charm, hunt.nickname)
    }
};