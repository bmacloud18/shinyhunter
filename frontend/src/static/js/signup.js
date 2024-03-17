//Sign up page script
import api from './APIclient.js';

const signup = document.getElementById('signup');
const signin = document.getElementById('signin');
const username = document.getElementById('username');
const password = document.getElementById('password');
const first_name = document.getElementById('first_name');
const last_name = document.getElementById('last_name');




document.addEventListener('DOMContentLoaded', function () {
    signup.addEventListener('click', e => {
        if (first_name.value.length > 1 && last_name.value.length > 1 && username.value.length > 4 && password.value.length > 3) {
            api.register(first_name.value, last_name.value, username.value, password.value).then(user => {
                const id = user.id;
                document.location = './userprofile?id=' + id;
                console.log('successfully signed up!')
                username.setCustomValidity('');
                username.reportValidity();
            }).catch((err) => {
                username.setCustomValidity('Username is taken');
                username.reportValidity();
                console.log(err);
            });
        }
    });
    signin.addEventListener('click', e => {
        document.location = "./signin";
    });
});
