
const express = require( 'express' );
const router = express.Router();

router.use(express.static('static'));
router.use(express.urlencoded({extended: true}));

const path = require('path');
const html_dir = path.join(__dirname ,'./views/templates2/');

// base
router.get('/', (req, res) => {
    res.sendFile(`${html_dir}login.html`);
});

// base
router.get('/login', (req, res) => {
    res.sendFile(`${html_dir}login.html`);
});

// signup
router.get('/signup', (req, res) => {
    res.sendFile(`${html_dir}signup.html`);
});

// userprofile
router.get('/userprofile', (req, res) => {
    res.sendFile(`${html_dir}userprofile.html`);
});

// user active hunt (interactive)
router.get('/activehunt', (req, res) => {
    res.sendFile(`${html_dir}activehunt.html`);
});

// hunt (noninteractive)
router.get( '/hunt', ( req, res ) => {
    res.sendFile(`${html_dir}hunt.html`);
});

// account settings
router.get( '/accountsettings', ( req, res ) => {
    res.sendFile(`${html_dir}accountsettings.html`);
});

// huntsettings
router.get( '/huntsettings', ( req, res ) => {
    res.sendFile(`${html_dir}huntsettings.html`);
});

// new hunt page
router.get( '/newhunt', ( req, res ) => {
    res.sendFile(`${html_dir}newhunt.html`);
});

// successful hunt
router.get( '/success', ( req, res ) => {
    res.sendFile(`${html_dir}success.html`);
});



module.exports = router;