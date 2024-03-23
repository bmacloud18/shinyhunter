//script to fill out header on most pages

import api from './APIclient.js';

export default {
    generate: (user) => {
        let logoutlink = document.createElement('button');
        logoutlink.innerHTML = "Logout";
        logoutlink.classList.add('button');
    
        let logo = document.querySelector('.hheader');
        logo.addEventListener('click', e => {
            document.location = './userprofile?id=' + user.id;
        });
        
        logoutlink.addEventListener("click", e => {
            e.preventDefault();
            api.logout().then(() => {
                localStorage.removeItem('user');
                document.location = './signin';
            });
        });
    
    
        let imglink = document.querySelector('.pfp');
        imglink.href = './userprofile?id=' + user.id;
        const img = document.createElement('img');
        img.src = user.avatar;
        img.classList.add('pfpheader');
        imglink.append(img);
    
    
        document.querySelector('.firstname').innerHTML = `${user.first_name}`;
        document.querySelector('.lastname').innerHTML = `${user.last_name}`;
        document.querySelector('.logoutbutton').appendChild(logoutlink);
    },

    update: (user) => {
        document.querySelector('.firstname').innerHTML = `${user.first_name}`;
        document.querySelector('.lastname').innerHTML = `${user.last_name}`;

        const imglink = document.querySelector('.pfp');
        const prev = document.getElementsByClassName('pfpheader')[0];
        imglink.removeChild(prev);

        const img = document.createElement('img');
        img.src = user.avatar;
        img.classList.add('pfpheader');
        imglink.append(img);
    }
}