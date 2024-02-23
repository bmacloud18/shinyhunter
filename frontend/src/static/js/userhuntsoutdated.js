//This script is for the user profile page, and loads all the user's hunts, filling the active and completed hunts sections
//This script should be imported by the current user profile page and the general user profile page
import api from './APIclient.js';
    
const activeContainer = document.querySelector('#activeHunts');
const finishedContainer = document.querySelector('#finishedHunts');

function createHunt(hunt) {
    const pkm = api.getPokemonByName(hunt.pkm);

    const section = document.createElement('section');
    section.classList.add('container');

    const date_header = document.createElement('h2');
    date_header.textContent = (hunt.end_date_dispay == null) ? hunt.start_date_display : hunt.end_date_display;

    const name_header = document.createElement('h1');
    name_header.textContent = pkm.name;
    if (hunt.nickname) {
        name_header.textContent = hunt.nickname;
    }

    const div = document.createElement('div');
    div.classList.add('hunt_details');
    const sprite = document.createElement('img');
    sprite.src = pkm.sprite;
    sprite.alt = 'Shiny Sprite';
    div.append(sprite);
    const elapsed_time = document.createElement('span');
    elapsed_time.textContent = hunt.hunt_time_display;
    div.append(elapsed_time);
    const count = document.createElement('span');
    count.textContent = hunt.count;
    div.append(count);
    

    section.append(name_header, date_header, div);
    section.style.color = pkm.color;
    return section;
}

function noHunts(text) {
    const status = text == 'No Hunts in Progress';
    const section = document.createElement('section');
    section.classList.add('container');
    const header = document.createElement('h1');
    header.textContent = text;
    const link = document.createElement('a');
    link.href = './home';
    link.classList.add('button', 'primaryColors', 'mediaButton');
    link.textContent = 'Find More Events!';
    section.append(header, link);
    if (status) {
        activeContainer.append(section);
    }
    else {
        finishedContainer.append(section);
    }
    
}

function deleteHunt(e) {
    console.log(e.target.huntId);
    
    api.deleteHunt(e.target.huntId).then(() => {
        location.reload();
    }).catch(() => {
        location.href = './guest';
    });
}

api.getCurrentUserHunts().then(hunts => {
    const active = 0;
    const finished = 0;
    for (const h of hunts) {
        const section = createHunt(h);
        
        if (h.end_date_display == null) {
            active++;
            activeContainer.append(section);
        }
        else {
            finished++;
            finishedContainer.append(section);
        }
    }

    if (active == 0) {
        noHunts('No Hunts in Progress');
    }
    if (finished == 0) {
        noHunts('Your Pokedex is Empty!');
    }
}).catch(() => {
    noHunts('No Hunts in Progress');
    noHunts('Your Pokedex is Empty!');
});
