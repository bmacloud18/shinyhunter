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

function saveDataLocallyAndIncrement(key) {
    count++;
    diff++;
    const data = {
        counter: count
    }
    saveDataToLocalStorage(key, data);
}

function saveDataLocallyAndDecrement(key) {
    count--;
    diff--;
    const data = {
        counter: count
    }
    saveDataToLocalStorage(key, data);
}

function saveCurrentHunt() {
    if ((diff != 0 || seconds > 3) && navigator.onLine) {
        const hunt = getDataFromLocalStorage('hunt');
        const stopwatch = getDataFromLocalStorage('stopwatchData');
        const counter = getDataFromLocalStorage('counterData');

        if (hunt && stopwatch && counter) {
            const newtime = hunt.hunt_time + stopwatch.elapsedTime;
            const count = counter.counter;
            api.updateHunt(hunt.id, newtime, hunt.start_date_string, hunt.end_date_string, count, hunt.increment, hunt.charm, hunt.nickname).then(res => {
                if (res.status == '200') {
                    localStorage.removeItem('hunt');
                    localStorage.removeItem('stopwatchData');
                    localStorage.removeItem('counterData');
                    console.log('update sent');
                }
                else {
                    console.error('Failed to sync data with server: ', res.status);
                }
            }).catch(err => {
                console.error('Error syncing data with server: ', err);
            });
        }
    }
}


api.getHuntById(page_id).then(async hunt => {
    saveDataToLocalStorage('hunt', hunt);
    const pkm = await api.getPokemonByName(hunt.pkm.toLowerCase());
    title.innerText = hunt.nickname || pkm.name.substring(0,1).toUpperCase() + pkm.name.substring(1);
    sub.innerText = convertTime(hunt.hunt_time);

    const stopwatchData = getDataFromLocalStorage('stopwatchData');
    const counterData = getDataFromLocalStorage('counterData');

    let hunt_time = hunt.hunt_time;
    

    let timer = new Timer({callback: function (e) {
        seconds++;
        const newtime = hunt_time + seconds;
        sub.innerText = convertTime(newtime);
        saveTimeDataLocally('stopwatchData');
    }, precision: 'seconds'});

    if (stopwatchData) {
        hunt_time += stopwatchData.elapsedTime;
        if (stopwatchData.isRunning) {
            resume(timer);
        }
        else {
            pause(timer);
        }
    }

    const spritelink = document.createElement('img');
    spritelink.alt = 'Shiny Sprite';
    spritelink.src = pkm.sprite;
    sprite.append(spritelink);
    sprite.addEventListener('click', e => {
        if (active) {
            pause(timer);
            saveTimeDataLocally('stopwatchData');
        }
        else {
            resume(timer);
            saveTimeDataLocally('stopwatchData');
        }
    })

    count = hunt.count;

    if (counterData) {
        count = counterData.counter;
    }

    countarea.innerText = count;
    plus.addEventListener('click', e => {
        saveDataLocallyAndIncrement('counterData');
        countarea.innerText = count;
    });

    minus.addEventListener('click', e => {
        saveDataLocallyAndDecrement('counterData');
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
            document.location = './finishedhunt?id=' + page_id;
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
    saveCurrentHunt();
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
document.addEventListener('visibilitychange', e => {
    saveCurrentHunt();
    localStorage.removeItem('hunt');
    localStorage.removeItem('stopwatchData');
    localStorage.removeItem('counterData');
});


