const express = require('express');
const router = express.Router();

router.use(express.static('static'));
router.use(express.urlencoded({extended: true}));

const path = require('path');
const html_dir = path.join(__dirname ,'../../templates/');

//base
router.get('/', (req, res) => {
    res.sendFile(`${html_dir}index.html`);
});

//index
router.get('/index', (req, res) => {
    res.sendFile(`${html_dir}index.html`);
});

//profile details
router.get('/userprofile', (req, res) => {
    res.sendFile(`${html_dir}userprofile.html`);
});

//sign in
router.get('/login', (req, res) => {
    res.sendFile(`${html_dir}login.html`);
});

//sign up
router.get('/signup', (req, res) => {
    res.sendFile(`${html_dir}signup.html`);
});