// This script will fill out any page where hunt settings are being updated
// Currently applies to three pages, newhunt, huntsettings, and importhunt

import api from './APIclient.js';
import header from './header.js'
import getPage from './getPage.js';

const url = window.location.href;

const query = window.location.search;
let parameters = new URLSearchParams(query);
let page_id = parameters.get('id');
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

        console.log(enddate.value, startdate.value);
        let location;
        if (pokemon.value != null && game.value != null && method.value != null) {
            let enddate_input = enddate.value;
            if (enddate_input == '') {
                enddate_input = null;
                location = './activehunt?id='
            }
            else {
                location = './finishedhunt?id='
            }
            api.createHunt(user.id, pokemon.value, game.value, method.value, startdate.value, enddate_input, time.value, count.value, increment.value, charm.value, nickname.value).then(hunt => {
                const id = hunt.id;
                document.location = location + id;
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
                document.location = './activehunt?id=' + id;
                console.log('new hunt started');
            }).catch((err) => {
                throw new Error('Error Occurred Creating Hunt: ' + err.message)
            });
        }
    });
}
else if (page == 'huntsettings') {
    if (page_id == null) {
        document.location = './newhunt';
    }
    api.getHuntById(page_id).then(hunt => {
        return api.getPokemonByName(hunt.pkm.toLowerCase()).then(pkm => {
            if (hunt.user != user.id) {
                document.location = './newhunt';
                console.log('cannot access other user hunts');
            }
            const header = document.getElementById('title');
            header.innerHTML = hunt.nickname;
            const hheader = document.getElementById('huntheader')
            const sprite = document.createElement('img');
            sprite.alt = 'Shiny Sprite';
            sprite.src = pkm.sprite;
            hheader.append(sprite);

            sprite.addEventListener('click', e => {
                document.location = "./activehunt?id=" + page_id;
            });

            submit.addEventListener('click', e => {
                api.updateHunt(hunt.id, time.value, count.value, increment.value, charm.value, nickname.value).then(hunt => {
                    const id = hunt.id;
                    document.location = './activehunt?id=' + id;
                    console.log('hunt updated');
                }).catch((err) => {
                    throw new Error('Error Occurred Updating Hunt: ' + err.message)
                });
            });
        }).catch((err) => {
            throw new Error('Error Occurred Getting Pokemon: ' + err.message)
        });
    }).catch((err) => {
        throw new Error('Error Occurred Getting Hunt: ' + err.message)
    });
    
    
}