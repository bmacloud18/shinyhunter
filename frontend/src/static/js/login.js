//Login page script
import api from './APIclient.js';

const signin = document.getElementById('signin');
const signup = document.getElementById('signup');
const username = document.getElementById('username');
const password = document.getElementById('password');




document.addEventListener('DOMContentLoaded', function () {
    signin.addEventListener('click', e => {
        api.login(username.value, password.value).then(user => {
            localStorage.setItem('user', JSON.stringify(user));
            const id = user.id;
            document.location = './userprofile?id=' + id;
            username.setCustomValidity('');
            username.reportValidity();
        }).catch((err) => {
            console.log('Username or Password Invalid');
            username.setCustomValidity('Username or Password Invalid');
            username.reportValidity();
        });
    });
    signup.addEventListener('click', e => {
       document.location = "./signup"; 
    });
});
