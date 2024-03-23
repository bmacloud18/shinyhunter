// This script will fill out any page where hunt settings are being updated
// Currently applies to three pages, newhunt, huntsettings, and importhunt

import api from './APIclient.js';
import header from './header.js'

const form = document.getElementById('f');
let form_type = "detail";

const first_name = document.getElementById('first_name');
const last_name = document.getElementById('last_name');
const username = document.getElementById('username');
const current_password = document.getElementById('current_password');
const new_password = document.getElementById('new_password');
const confirm_password = document.getElementById('confirm_password');

const change = document.getElementById('changebutton');
const submit = document.getElementById('submitbutton');

let user = await api.getCurrentUser();
header.generate(user);

const canceldisplay = document.getElementById('cancelbutton');
canceldisplay.style.display = 'flex';

const cancel = document.getElementById('cancel');
cancel.addEventListener('click', e => {
    document.location = './userprofile?=' + user.id;
});

const userheader = document.getElementById('name');
userheader.innerHTML = user.first_name + " " + user.last_name;

const input = document.getElementById('image_up');
const preview = document.getElementById('image_preview');
const pfp = document.createElement('img');
pfp.alt = 'User PFP';
pfp.classList.add('new_pfp');
pfp.src = user.avatar;
preview.append(pfp);
let formdata = new FormData();
let file_name;

input.addEventListener('change', e => {
    const file = input.files[0];
    file_name = file.name;
    if (file != null) {
        const reader = new FileReader();
        formdata = new FormData();
        reader.readAsDataURL(file);
        console.log(reader);
        reader.onload = function(e) {
            if (file.type.substring(0, 5) != 'image') {
                input.setCustomValidity('File not a valid image');
            }
            else {
                pfp.src = e.target.result;
                input.setCustomValidity('');
                formdata.append('pfp', file);
            }
        }
    }

    console.log(formdata, file_name, user.avatar);
});


submit.addEventListener('click', async e => {
    console.log('submit clicked');
    if (form_type == "detail") {

        //check for which details have been changed
        let first_val = first_name.value;
        let last_val = last_name.value;
        let user_val = username.value;
        if (first_val.length == 1) {
            first_val = user.first_name;
            first_name.setCustomValidity('Please enter a longer first name');
            first_name.reportValidity();
        }
        if (first_val.length == 0) {
            first_val = user.first_name;
        }
        if (last_val.length == 1) {
            last_val = user.last_name;
            last_name.setCustomValidity('Please enter a longer last name');
            last_name.reportValidity();
        }
        if (last_val.length == 0) {
            last_val = user.last_name;
        }
        if (user_val.length <= 4) {
            if (user_val.length != 0) {
                username.setCustomValidity('Please enter a longer username');
                username.reportValidity();
            }
            else {
                user_val = user.username;
            }
        }
        
        //uploaded changed image file, delete old image file if exists
        let avatar_string = user.avatar;
        console.log(avatar_string);
        if (file_name != null) {
            const url = 'images/';
            avatar_string = 'images/' + file_name;
            file_name = null;
            try {
                const res = await fetch(user.avatar, {
                    method: 'GET'
                });

                if (res.status == 404) {
                    const err = new Error("404");
                    throw err;
                }

                if (res.status == 200) {
                    const deleteres = await fetch(user.avatar, {
                        method: 'DELETE'
                    });

                    if (deleteres.status == 200) {
                        await fetch(url, {
                            method: 'POST',
                            body: formdata
                        })
                        .catch((err) => {
                            input.setCustomValidity('Problem changing pfp image');
                            input.reportValidity();
                            throw new Error('Error Uploading Image: ' + err);
                        });
                    }
                }
            } catch (err) {
                if (err.message == "404") {
                    await fetch(url, {
                        method: 'POST',
                        body: formdata
                    })
                    .catch((err) => {
                        input.setCustomValidity('Problem changing pfp image');
                        input.reportValidity();
                        throw new Error('Error Uploading Image (no delete): ' + err);
                    });
                }
                else {
                    throw new Error('Something wrong with get');
                }
            }
        }

        //update any values that have changed
        try {
            const update = await api.updateCurrentUserSettings(first_val, last_val, user_val, avatar_string);
            user = update;
            header.update(user);
        } catch (err){
            username.setCustomValidity('Username may be taken');
            username.reportValidity();
            throw new Error('Error Occurred Updating User: ' + err.message)
        }
    }
    else if (form_type =="password") {
        if (new_password.value.length > 3) {
            if (confirm_password.value == new_password.value) {
                api.updatePassword(current_password.value, new_password.value).then(() => {
                    document.location = './userprofile?=' + user.id;
                    console.log('user updated');
                }).catch(err => {
                    current_password.setCustomValidity('Password Invalid');
                    current_password.reportValidity();
                    throw new Error('Password Invalid: ' + err.message);
                });
            }
            else {
                confirm_password.setCustomValidity('Passwords do not match');
                confirm_password.reportValidity();
            }
        }
        else if (password.value.length <= 3) {
            password.setCustomValidity('Please enter a longer password');
            password.reportValidity();
        }
    }
});

change.addEventListener('click', e => {
    console.log('change clicked');
    const p_list = document.getElementsByClassName('password_display');
    const d_list = document.getElementsByClassName('detail_display');
    console.log(p_list, d_list);
    console.log(form_type);
    if (form_type === "detail") {
        form_type = "password";
        for (let i = 0; i < p_list.length; i++) {
            p_list[i].style.display = 'flex';
            console.log(i);
        }
        for (let i = 0; i < d_list.length; i++) {
            d_list[i].style.display = 'none';
            console.log(i);
        }

        change.innerText = 'Change Settings';
        submit.innerText = 'Update Password'
    }
    else if (form_type === "password") {
        form_type = "detail";
        for (let i = 0; i < p_list.length; i++) {
            p_list[i].style.display = 'none';
            console.log(i);
        }
        for (let i = 0; i < d_list.length; i++) {
            d_list[i].style.display = 'flex';
            console.log(i);
        }

        change.innerText = 'Change Password';
        submit.innerText = 'Update Settings'
    }
})