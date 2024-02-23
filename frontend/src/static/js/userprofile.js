//This script will fill out the general profile page, along with the userhunts script

import api from './APIclient.js';

const query = window.location.search;
let parameters = new URLSearchParams(query);
let id = parameters.get('id');

let currentuserprofile = false;

api.getCurrentUser().then(currentuser => {
    console.log(currentuser);
    header(currentuser);
    console.log('header filled');
    const cid = currentuser.id;
    if (cid == id) {
        // posts(currentuser);
        currentuserprofile = true;
        profileDetails(currentuser, currentuser);
        console.log('current user profile');
    }
    else {
        api.getUserById(id).then(user => {
            // posts(user);
            profileDetails(currentuser, user);
            console.log('user profile');
        });
    }
});

// document.addEventListener('DOMContentLoaded', function () {

    
// });



//generate header
function header(user) {
    let logoutlink = document.createElement('button');
    logoutlink.innerHTML = "Logout";
    logoutlink.classList.add('logoutbtn');

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
            console.log(hunts);
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
                        console.log(message);
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
    let activehunts = document.querySelector(".active");
    let completedhunts = document.querySelector(".completed");
    followinglist.innerHTML = '<h3>Following</h3>';
    api.getHuntsByUser(user.id).then(hunts => {
        // create a hunt container/object
        hunts.forEach(hunt => {
            const name = hunt.pkm;
            let mon;
            let type1;
            let type2;

            api.getPokemonByName(name).then(pkm => {
                mon = pkm;
            });
            
            type1 = mon.types[0].type.name;
            if (mon.types[1].type.name != null)
                type2 = mon.types[1].type.name;

            let li = document.createElement('li');

            let active = hunt.end_date_string == null;
            const imglink = document.createElement('a');
            const img = document.createElement('img');
            if(active && currentuserprofile) {
                imglink.href = './activehunt?id=' + hunt.id;
            }
            else {
                imglink.href = './hunt?id=' + hunt.id;
            }
            img.src = mon.sprites.front_shiny;
            img.classList.add('pkm_pic')
            imglink.append(img);
            li.append(imglink);
            li.append(`${name}` + '  ' + `${hunt.count}`);

            if (active) {
                activehunts.appendChild(li);
            }
            else {
                completedhunts.appendChild(li);
            }
            
        });
    });
}
