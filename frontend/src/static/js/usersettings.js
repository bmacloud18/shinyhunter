// This script will fill out any page where hunt settings are being updated
// Currently applies to three pages, newhunt, huntsettings, and importhunt

import api from './APIclient.js';
import header from './header.js'


const query = window.location.search;

const username = document.getElementById('username');
const password = document.getElementById('password');
const first_name = document.getElementById('first_name');
const last_name = document.getElementById('last_name');

const submit = document.getElementById('submitbutton')

const user = await api.getCurrentUser();
header(user);

const canceldisplay = document.getElementById('cancelbutton');
canceldisplay.style.display = 'flex';

const cancel = document.getElementById('cancel');
cancel.addEventListener('click', e => {
    document.location = './userprofile?=' + user.id;
});

const userheader = document.getElementById('name');
userheader.innerHTML = user.first_name + " " + user.last_name;
const hheader = document.getElementById('userheader')
const pfp = document.createElement('img');
pfp.alt = 'User PFP';
pfp.src = pkm.pfp;
hheader.append(pfp);

submit.addEventListener('click', e => {
    api.updateHunt(hunt.id, time.value, count.value, increment.value, charm.value, nickname.value).then(hunt => {
        const id = hunt.id;
        document.location = './activehunt?id=' + id;
        console.log('hunt updated');
    }).catch((err) => {
        throw new Error('Error Occurred Updating Hunt: ' + err.message)
    });
}).catch((err) => {
    throw new Error('Error Occurred Getting Hunt: ' + err.message)
});