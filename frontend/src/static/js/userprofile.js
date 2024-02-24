//This script will fill out the general profile page, along with the userhunts script

import api from './APIclient.js';

const query = window.location.search;
let parameters = new URLSearchParams(query);
let id = parameters.get('id');

let currentuserprofile = false;

api.getCurrentUser().then(currentuser => {
    header(currentuser);
    const cid = currentuser.id;
    if (cid == id) {
        // posts(currentuser);
        currentuserprofile = true;
        const newhunt = document.getElementById('huntbtndiv');
        newhunt.style.visibility = 'visible';

        const newhuntbtn = document.getElementById('huntbutton');
        newhuntbtn.addEventListener('click', (e) => {
            document.location = './newhunt';
        });
        profileDetails(currentuser, currentuser);
    }
    else {
        api.getUserById(id).then(user => {
            // posts(user);
            profileDetails(currentuser, user);
        }).catch((err) => {
            throw new Error("Error Occurred: " + err.message);
        });
    }
}).catch((err) => {
    throw new Error("Error Occurred: " + err.message);
});



function createHunt(hunt, pkm, active) {
    const section = document.createElement('li');

    const date_header = document.createElement('span');
    date_header.classList.add('date_display');
    date_header.textContent = (active) ? hunt.start_date_display : hunt.end_date_display;

    const name_header = document.createElement('span');
    name_header.classList.add('name_display');
    name_header.textContent = pkm.name;
    if (hunt.nickname) {
        name_header.textContent = hunt.nickname;
    }

    const div = document.createElement('div');
    div.classList.add('hunt_details');
    const sprite = document.createElement('img');
    sprite.alt = 'Shiny Sprite';
    const spritelink = document.createElement('a');
    if(active && currentuserprofile) {
        spritelink.href = './activehunt?id=' + hunt.id;
    }
    else {
        spritelink.href = './hunt?id=' + hunt.id;
    }
    sprite.src = pkm.avatar;
    sprite.classList.add('pkm_pic')
    spritelink.append(sprite);
    const elapsed_time = document.createElement('span');
    elapsed_time.textContent = hunt.hunt_time_display;
    elapsed_time.classList.add('time_display');
    const count = document.createElement('span');
    count.classList.add('count_display');
    count.textContent = hunt.count;

    const left = document.createElement('div');
    left.classList.add('left');
    left.append(sprite);

    const right = document.createElement('div');
    right.classList.add('right');
    right.append(count);


    div.append(left, right);

    
    const main = document.createElement('div');
    main.classList.add('main');
    main.append(name_header, date_header, elapsed_time, div);

    main.addEventListener('click', (e) => {
        document.location = './hunt?id=' + hunt.id;;
    });

    section.append(main);
    section.style.color = pkm.color;
    return section;
}


//generate header
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


async function profileDetails(currentuser, user) {
    //setting profile details left side
    document.querySelector('.userpfp').innerHTML = `<img src="${user.avatar}" alt="Image Preview" id="img">`;
    document.querySelector('.fullname').innerHTML = `${user.first_name}` + ` ` + `${user.last_name}`;
    document.querySelector('.username').innerHTML = `@` + `${user.username}`;

    //setting follow button on right side of profile details
    if (currentuserprofile) {
        let editbutton = document.querySelector('#followbutton');
        editbutton.innerText = "Edit Profile";
    }
    else {
        api.getCurrentUserHunts().then(hunts => {
            let alreadyFollowing = false;
            // following.forEach(follow => { 
            //     if (follow.id == user.id) {
            //         alreadyFollowing = true;
            //     }
            // });
            let followbutton = document.querySelector('#followbutton');
            if(alreadyFollowing) {
                followbutton.innerText = "Unfollow"
                followbutton.addEventListener('click', e => {
                    api.unfollow(user.id).then(message => {
                        profileDetails(currentuser, user);
                    }).catch((error) => {
                        console.log("could not unfollow" + user.username)
                    });
                });
            }
            else {
                followbutton.innerText = "Follow"
                // followbutton.addEventListener('click', e => {
                //     api.follow(user.id).then(message => {
                //         console.log(message);
                //         profileDetails(currentuser, user);
                //     }).catch((error) => {
                //         console.log("could not follow " + user.username)
                //     });
                // });
            }
        });
    }
    
    //getting and propogating following list
    let activehunts = document.querySelector("#active");
    let completedhunts = document.querySelector("#completed");
    let huntPromises = [];
    api.getHuntsByUser(user.id).then(hunts => {
        // create a hunt container/object
        huntPromises = hunts.map(hunt => {
            const name = hunt.pkm;
            // Return a promise for each getPokemonByName call
            return api.getPokemonByName(name.toLowerCase()).then(pkm => {
                return {hunt, pkm};
            }).catch(err => {
                console.log('API error');
                throw new Error("Couldn't find pokemon - " + err.message);
            });
        });

        // Wait for all promises to resolve
        Promise.all(huntPromises).then(results => {
            results.forEach(({ hunt, pkm }) => {
                const active = hunt.end_date_string == null;

                const section = createHunt(hunt, pkm, active);

                if (active) {
                    activehunts.appendChild(section);
                }
                else {
                    completedhunts.appendChild(section);
                }
            });
        }).catch(err => {
            throw new Error("Error occurred: " + err.message);
        });

    }).catch((err) => {
        throw new Error("Error Occurred: " + err.message);
    });
}




// -> for later

//generate main page posts
// function posts(user) {
//     api.getPostsByOP(user.id).then(posts => {
//         fillHowlsDisplay(howls);
//     }).catch((error) => {
//         console.log(error);
//     });
// }

// function fillHowlsDisplay(howls) {
//     const howlDisplay = document.getElementById('howls');
//     howls.forEach(howl => {
//         howlDisplay.append(generateHowl(howl));
//     })
// }

// function generateHowl(howl) {
//     const item = document.createElement('div');
//     item.classList.add('howl');

//     console.log(howl);

//     api.getUserById(howl.userId).then(user => {
//         const detailsbox = document.createElement('div');
//         detailsbox.classList.add('detailsbox');
//         const userdetails = document.createElement('div');
//         userdetails.classList.add('opdetails');

//         const imglink = document.createElement('a');
//         imglink.href = './userprofile?id=' + user.id;
//         const img = document.createElement('img');
//         img.src = user.avatar;
//         img.classList.add('howlpfp')
//         imglink.append(img);
//         userdetails.append(imglink);

//         const op = document.createElement('div');
//         const opdatafullname = document.createElement('h5');
//         const opdatausername = document.createElement('h6');


//         opdatafullname.innerHTML =  user.first_name + " " +  user.last_name;
//         opdatausername.innerHTML = "@" + user.username;
//         op.classList.add('op')
//         op.append(opdatafullname);
//         op.append(opdatausername);
//         userdetails.append(op);

//         userdetails.addEventListener('click', e => {
//             document.location = './userprofile?id=' + user.id;
//         });
        
//         detailsbox.appendChild(userdetails);

//         const timestamp = document.createElement('div');
//         timestamp.classList.add('timestamp');

//         let timestampdata = document.createElement('div');
//         timestampdata.classList.add('timedata');


//         let postdate = new Date(howl.datetime)
//         let datestring = postdate.toDateString();
//         let timestring = postdate.toLocaleTimeString();

//         let dws = 0;
//         let idx = 0;
//         let fullstring = "";
//         let dcc = datestring.charAt(idx);
//         while (dws < 3)
//         {
//             if (dcc == " ") {
//                 dws++;
//             }
//             fullstring = fullstring + dcc;
//             idx++;
//             dcc = datestring.charAt(idx);
//         }

//         fullstring = fullstring.substring(0, fullstring.length - 1) + ", ";

//         idx = 0;
//         let tcol = 0;
//         let tcc = timestring.charAt(idx);
//         while (tcol < 2)
//         {
//             if (tcc == ":") {
//                 tcol++;
//             }
//             fullstring = fullstring + tcc;
//             idx++;
//             tcc = timestring.charAt(idx);
//         }

//         let timesuffix = timestring.substring(timestring.length - 2, timestring.length) == "PM" ? "pm" : "am";

//         timestampdata.innerHTML = fullstring.substring(0, fullstring.length - 1) + timesuffix;
//         timestamp.append(timestampdata);
//         detailsbox.append(timestamp);

//         const text = document.createElement('span');
//         text.innerHTML = howl.text;
//         text.classList.add('howlmsg');
//         item.append(detailsbox);
//         item.append(text);
//     }).catch((error) => {
//         console.log(error);
//     })

//     return item;
// }

// function resetHowls() {
//     const howlDisplay = document.getElementById('howls')
//     howlDisplay.innerHTML = '';
//     howls();
// }


