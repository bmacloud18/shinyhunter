//This script will fill out the new hunt page

import api from './APIclient.js';

const url = window.location.href;


function getPage(url) {
    const lastIndex = url.lastIndexOf('/');
    
    if (lastIndex !== -1) {
        return url.slice(lastIndex + 1);
    }
    else {
        return url;
    }
}

const page = getPage(url);


const nickname = document.getElementById('nickname');

const increment = document.getElementById('increment');
const charm = document.getElementById('charm');

const count = document.getElementById('count');
const time = document.getElementById('time');

const submit = document.getElementById('submitbutton')

const user = await api.getCurrentUser();
header(user);

if (page == 'importhunt' || page == 'newhunt') {
    const pokemon = document.getElementById('pokemonSelect');
    const game = document.getElementById('gameSelect');
    const method = document.getElementById('methodSelect');

    const allMons = await api.getAllMons();
    const allGames = await api.getAllGames();
    const allMethods = await api.getAllMethods();

    console.log(allMons, allGames);

    allMons.forEach(mon => {
        const option = document.createElement('option');
        option.text = mon.name.charAt(0).toUpperCase() + mon.name.slice(1);
        pokemon.add(option);
    });

    allGames.forEach(g => {
        const option = document.createElement('option');
        option.text = g.name.charAt(0).toUpperCase() + g.name.slice(1);
        game.add(option);
    });

    allMethods.forEach(m => {
        const option = document.createElement('option');
        option.text = m.name;
        option.value = m.id;
        method.add(option);
    });
}

if (page == 'importhunt') {
    const pokemon = document.getElementById('pokemonSelect');
    const game = document.getElementById('gameSelect');
    const method = document.getElementById('methodSelect');
    const startdate = document.getElementById('startdate');
    const enddate = document.getElementById('enddate');

    submit.addEventListener('click', e => {
        if (pokemon.value != null && game.value != null && method.value != null) {
            api.createHunt(user.id, pokemon.value, game.value, method.value, startdate.value, enddate.value, time.value, count.value, increment.value, charm.value, nickname.value).then(hunt => {
                const id = hunt.id;
                document.location = './hunt?id=' + id;
                console.log('new hunt imported');
            }).catch((err) => {
                throw new Error('Error Occurred Creating Hunt: ' + err.message)
            });
        }
    });
}
else if (page == 'newhunt') {
    console.log(page);
    const pokemon = document.getElementById('pokemonSelect');
    const game = document.getElementById('gameSelect');
    const method = document.getElementById('methodSelect');
    submit.addEventListener('click', e => {
        e.preventDefault();
        if (pokemon.value != null && game.value != null && method.value != null) {
            api.createHunt(user.id, pokemon.value, game.value, method.value, new Date(), null, time.value, count.value, increment.value, charm.value, nickname.value).then(hunt => {
                console.log(hunt);
                const id = hunt.id;
                // document.location = './activehunt?id=' + id;
                console.log('new hunt started');
            }).catch((err) => {
                throw new Error('Error Occurred Creating Hunt: ' + err.message)
            });
        }
    });
}
else if (page == 'huntsettings') {
    submit.addEventListener('click', e => {
        api.updateHunt(user.id, time.value, count.value, increment.value, charm.value, nickname.value).then(hunt => {
            const id = hunt.id;
            document.location = './activehunt?id=' + id;
            console.log('hunt updated');
        }).catch((err) => {
            throw new Error('Error Occurred Creating Hunt: ' + err.message)
        });
    });
}

function header(user) {
    let logoutlink = document.createElement('button');
    logoutlink.innerHTML = "Logout";
    logoutlink.classList.add('button');

    let logo = document.querySelector('.hheader');
    logo.addEventListener('click', e => {
        // document.location = './login';
    });
    
    logoutlink.addEventListener("click", e => {
        e.preventDefault();
        api.logout().then(() => {
            localStorage.removeItem('user');
            // document.location = './login';
        });
    });


    let imglink = document.querySelector('.pfp')
    imglink.href = './userprofile?id=' + user.id;
    const img = document.createElement('img');
    img.src = user.avatar;
    img.classList.add('howlpfpheader')
    imglink.append(img);


    document.querySelector('.firstname').innerHTML = `${user.first_name}`;
    document.querySelector('.lastname').innerHTML = `${user.last_name}`;
    document.querySelector('.logoutbutton').appendChild(logoutlink)
}