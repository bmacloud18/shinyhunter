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

const user = await api.getCurrentUser();
header(user);

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
pfp.src = user.avatar;
preview.append(pfp);

input.addEventListener('change', e => {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(e) {
            if (file.type.substring(0, 5) != 'image') {
                input.setCustomValidity('File not a valid image');
            }
            else {
                pfp.src = e.target.result;
                input.setCustomValidity('');
            }
        }
    }   
});


submit.addEventListener('click', e => {
    if (form_type == "details") {
        if (first_name.value.length > 1 && last_name.value.length > 1 && username.value.length > 4) {
            api.updateCurrentUserSettings(first_name.value, last_name.value, username.value, avatar.value).then(() => {
                document.location = './userprofile?=' + user.id;
                console.log('user updated');
            }).catch((err) => {
                username.setCustomValidity('Username may be taken');
                username.reportValidity();
                throw new Error('Error Occurred Updating User: ' + err.message)
            });
        }
        else if (first_name.value.length <= 1) {
            first_name.setCustomValidity('Please enter a name');
            first_name.reportValidity();
        }
        else if (last_name.value.length <= 1) {
            last_name.setCustomValidity('Please enter a name');
            last_name.reportValidity();
        }
        else if (username.value.length <= 4) {
            username.setCustomValidity('Please enter a longer username');
            username.reportValidity();
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