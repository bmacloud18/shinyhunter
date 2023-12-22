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
    const header = document.createElement('h1');
    header.textContent = hunt.pokemon;
    const div = document.createElement('div');
    const start_date = document.createElement('span');
    start_date.textContent = hunt.start_date_converted;
    div.append(date);
    const sprite = document.createElement('img');
    sprite.src = hunt.sprite;
    sprite.alt = 'Shiny Sprite';
    const button = document.createElement('button');
    button.type = 'button';
    button.classList.add('button', 'primaryColors', 'mediaButton');
    button.textContent = 'Remove Hunt';
    button.huntId = hunt.id;
    button.addEventListener('click', deleteHunt);

    const confirmButton = document.createElement('button');
    confirmButton.type = 'button';
    confirmButton.style.display = 'none';
    confirmButton.classList.add('button', 'primaryColors', 'mediaButton');
    confirmButton.textContent = 'Confirm Send';
    confirmButton.ticketId = ticket.id;
    confirmButton.addEventListener('click', e => {
        deleteHunt(e.target.ticketId, usernameInput.value);
    });

    const sendButton = document.createElement('button');
    sendButton.type = 'button';
    sendButton.classList.add('button', 'primaryColors', 'mediaButton');
    sendButton.textContent = 'Send Ticket';
    sendButton.ticketId = ticket.id;
    sendButton.addEventListener('click', e => {
        usernameInput.style.display = 'block';
        confirmButton.style.display = 'block';
    });

    

    section.append(header, div, qr, bar, button, sendButton, usernameInput, confirmButton);
    return section;
}

// <section>
//     <h1>No tickets found for this event!</h1>
//     <a class="button primaryColors mediaButton" href="./home">Find More Events!</a>
// </section>
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
        noTickets();
    else {
        for (const hunts of hunts) {
            const section = createHunt(hunt);
            huntContainer.append(section);
        }
    }
}).catch(() => {
    noHunts();
});

