//This script will fill out the new hunt page

import api from './APIclient.js';


if (newhunt) {
    selections.style.display = 'none';
    dates.style.display = 'none';
}
else {
    const allMons = await api.getAllMons();
    const allGames = await api.getAllGames();
    const allMethods = await api.getAllMethods();

    allMons.forEach(mon => {
        const option = document.createElement('option');
        option.text = mon.name;
        pokemon.add(option);
    });

    allGames.forEach(game => {
        const option = document.createElement('option');
        option.text = game.name;
        pokemon.add(option);
    });

    allMethods.forEach(method => {
        const option = document.createElement('option');
        option.text = method.name;
        pokemon.add(option);
    });
}




const newhunt = true;

const selections = document.getElementById('selections');
const dates = document.getElementById('middle');

const pokemon = document.getElementById('pokemonSelect');
const game = document.getElementById('gameSelect');
const method = document.getElementById('methodSelect');

const nickname = document.getElementById('nickname');

const increment = document.getElementById('increment');
const charm = document.getElementById('charm');

const startdate = document.getElementById('startdate');
const enddate = document.getElementById('enddate');

const count = document.getElementById('count');
const time = document.getElementById('time');

api.getAllMons().then(mons => {

});