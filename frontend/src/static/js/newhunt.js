//This script will fill out the new hunt page

import api from './APIclient.js';

const newhunt = true;

const selections = document.getElementById('selections');
const dates = document.getElementById('middle');

const pokemon = document.getElementById('pokemonSelect');
const game = document.getElementById('gameSelect');
const method = document.getElementById('methodSelect');

if (!newhunt) {
    selections.style.display = 'none';
    dates.style.display = 'none';
}
else {
    const allMons = await api.getAllMons();
    const allGames = await api.getAllGames();
    // const allMethods = await api.getAllMethods();

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

    // allMethods.forEach(m => {
    //     const option = document.createElement('option');
    //     option.text = m.name;
    //     method.add(option);
    // });
}



const nickname = document.getElementById('nickname');

const increment = document.getElementById('increment');
const charm = document.getElementById('charm');

const startdate = document.getElementById('startdate');
const enddate = document.getElementById('enddate');

const count = document.getElementById('count');
const time = document.getElementById('time');

const starthunt = document.getElementById('startbutton')

api.getCurrentUser().then(user => {
    header(user);
    starthunt.addEventListener('click', e => {
        if (pokemon.value != null && game.value != null && method.value != null) {
            api.createHunt(user.id, pokemon.value, game.value, method.value, startdate.value, enddate.value, time.value, count.value, increment.value, charm.value, nickname.value).then(hunt => {
                const id = hunt.id;
                document.location = './activehunt?id=' + id;
                console.log('new hunt started');
            }).catch((err) => {
                throw new Error('Error Occurred Creating Hunt: ' + err.message)
            });
        }
    });
});

function header(user) {
    let logoutlink = document.createElement('button');
    logoutlink.innerHTML = "Logout";
    logoutlink.classList.add('button');

    let logo = document.querySelector('.hheader');
    logo.addEventListener('click', e => {
        document.location = './login';
    });
    
    logoutlink.addEventListener("click", e => {
        e.preventDefault();
        api.logout().then(() => {
            localStorage.removeItem('user');
            document.location = './login';
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