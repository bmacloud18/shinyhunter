import api from './APIclient.js';

const huntContainer = document.querySelector('#huntContainer');

function deleteHunt(e) {
    console.log(e.target.huntId);
    
    api.deleteHunt(e.target.huntId).then(() => {
        location.reload();
    }).catch(() => {
        location.href = './guest';
    });
}

function createHunt(hunt) {
    const section = document.createElement('section');
    section.classList.add('container');

    const date_header = document.createElement('h2');
    date_header.textContent = hunt.start_date_display;

    const name_header = document.createElement('h1');
    name_header.textContent = hunt.pokemon;
    if (hunt.nickname) {
        name_header.textContent = hunt.nickname;
    }

    const div = document.createElement('div');
    div.classList.add('hunt_details');
    const sprite = document.createElement('img');
    sprite.src = hunt.sprite;
    sprite.alt = 'Shiny Sprite';
    div.append(sprite);
    const elapsed_time = document.createElement('span');
    elapsed_time.textContent = hunt.hunt_time_display;
    div.append(elapsed_time);
    const count = document.createElement('span');
    count.textContent = hunt.count;
    div.append(count);
    

    section.append(name_header, date_header, div);
    return section;
}

function noHunts() {
    const section = document.createElement('section');
    section.classList.add('container');
    const header = document.createElement('h1');
    header.textContent = 'No hunts found for this user';
    const link = document.createElement('a');
    link.href = './home';
    link.classList.add('button', 'primaryColors', 'mediaButton');
    link.textContent = 'Find More Events!';
    section.append(header, link);
    ticketContainer.append(section);
}

api.getCurrentUserHunts().then(hunts => {
    if (hunts.length === 0)
        noHunts();
    else {
        for (const h of hunts) {
            const section = createHunt(h);
            huntContainer.append(section);
        }
    }
}).catch(() => {
    noHunts();
});

