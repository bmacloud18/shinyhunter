const express = require('express');
const router = express.Router();

router.use(express.static('static'));
router.use(express.urlencoded({extended: true}));

// base
router.get( '/', ( req, res ) => {
    res.redirect( '/login' );
});

// login
router.get( '/login', ( req, res ) => {
    const data = { title: 'Welcome!' };
    res.render('login', data );
});

// login
router.get( '/signup', ( req, res ) => {
    const data = { title: 'Welcome!' };
    res.render('signup', data );
});

// home
router.get( '/home', ( req, res ) => {
    const data = { title: 'Welcome!' };
    res.render('homepage', data );
});

// hunt
router.get( '/hunt', ( req, res ) => {
    const data = { title: 'Hunting' };
    res.render('hunt', data );
});

// account settings
router.get( '/accountsettings', ( req, res ) => {
    const data = { title: 'Settings' };
    res.render('accountsettings', data );
});

// add a new finished hunt
router.get( '/addcaught', ( req, res ) => {
    const data = { title: 'Add New Hunt' };
    res.render('addcaught', data );
});

// caught
router.get( '/caught', ( req, res ) => {
    const data = { title: 'Completed Hunts' };
    res.render('caught', data );
});

// huntsettings
router.get( '/huntsettings', ( req, res ) => {
    const data = { title: 'Hunt Settings' };
    res.render('huntsettings', data );
});

// new hunt
router.get( '/newhunt', ( req, res ) => {
    const data = { title: 'Begin Hunt' };
    res.render('newhunt', data );
});

// successful hunt
router.get( '/success', ( req, res ) => {
    const data = { title: 'Congratulations!' };
    res.render('success', data );
});

// user profile
router.get( '/userprofile', ( req, res ) => {
    const data = { title: 'User Profile' };
    res.render('userprofile', data );
});

module.exports = router;