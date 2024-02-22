// const express = require('express');
// const cookieParser = require('cookie-parser');

import express from 'express';
import cookieParser from 'cookie-parser';
import {tokenMiddleware} from '../middleware/tokenMiddleware.js';
import UserDAO from '../../objects/DAOs/UserDAO.js';

const router = express.Router();
router.use(cookieParser());
router.use(express.json());

// const UserDAO = require('../../objects/DAOs/UserDAO.js')
// const {tokenMiddleware, generateToken, removeToken} = require('../middleware/tokenMiddleware');

//get user by their id
router.get('/users/:userId', tokenMiddleware, (req, res) => {
    const userId = req.params.userId;

    UserDAO.getUserById(userId).then(user => {
        res.json(user);
    }).catch(() => {
        res.status(404).json(('user not found'));
    });
});

//**Registration**\\
router.post('/register', (req, res) => {

    UserDAO.getUser(req.body.username).then(() => {
        res.status(404).json(('user already exists'));
    }).catch(() => {
        UserDAO.signup(req.body).then(user => {
            generateToken(req, res, user);
            res.json(user);
        });
    });

});

//**Authentication**\\
router.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if ( username && password ) {
        UserDAO.login(username, password).then(user => {
            generateToken(req, res, user);
            res.json(user);
        }).catch( (err) => {
            res.status( 401 ).json( {error: 'Oops! Invalid username or password.'} );
        });
    }
    else
        res.status( 401 ).json( {error: 'Oops! Not authenticated.'} );
});

//logout
router.post('/logout', (req, res) => {
    removeToken(req, res);

    res.json({success: true});
});

//get logged in user
router.get('/currentuser', tokenMiddleware, (req, res) => {

    UserDAO.getUserById(req.user.id).then(user => {
        res.json(user);
    }).catch( (err) => {
        res.status( 401 ).json( {error: 'Oops! Not authenticated.'} );
    });

});

//update current user info
router.put('/currentuser', tokenMiddleware, async (req, res) => {

    // check if username is taken
    if ( req.user.username !== req.body.username ) {
        const user = await UserDAO.getUser( req.body.username ).catch( () => {
            return; // do nothing
        });

        // updated username exists
        if ( user ) {
            res.status( 403 ).json( {error: `Oops! Username ${user.username} is unavailable.`} );
            return;
        }
    }

    // update user information
    UserDAO.updateUser( req.user.id, req.body ).then(user => {
        res.json(user.username + ' updated');
    }).catch( () => {
        res.status( 401 ).json( {error: 'Oops! Not authenticated.'} );
    });

});

//update current user info and password
router.put('/currentuser/password', tokenMiddleware, (req, res) => {

    UserDAO.updatePassword(req.user.id, req.body?.password, req.body?.new_password).then(user => {
        res.json(user.username + ' updated');
    }).catch( () => {
        res.status( 401 ).json( {error: 'Oops! Not authenticated.'} );
    });

});

//update general user settings
router.put('/currentuser/settings', tokenMiddleware, (req, res) => {

    UserDAO.updateSettings( req.user.id, req.body ).then( user => {
        res.json( user );
    }).catch( err => {
        res.status( 500 ).json( {error: err.message} );
    });

});

export default router;