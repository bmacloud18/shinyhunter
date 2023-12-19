import express from 'express';
import cookieParser from 'cookie-parser';
const router = express.Router();
router.use(cookieParser());
router.use(express.json());
import UserDAO from('../../objects/DAOs/UserDAO');
import HuntDAO from('../../objects/DAOs/HuntDAO');
import { tokenMiddleware, generateToken, removeToken } from '../middleware/tokenMiddleware';
import PokemonDAO from '../../objects/DAOs/PokemonDAO';

router.get('/users/:userId', tokenMiddleware, (req, res) => {
    const userId = req.params.userId;
    UserDAO.getUserById(userId).then(user => {
        res.json(user);
    }).catch(() => {
        res.status(404).json(('user not found'));
    });
});

router.get('/users/current/hunts', tokenMiddleware, async (req, res) => {
    UserDAO.getUserEvents( req.user.id ).then( events => {
        sortEvents( events );
        res.json( events );
    }).catch( () => {
        res.status( 404 ).json( {error: 'Oops! Events not found.'} );
    });
});

router.get('/users/current/hunts/active', tokenMiddleware, async (req, res) => {
    const userId = req.user.id;
    UserDAO.getUserEvents(userId).then( events => {
        const now = new Date();
        let futureEvents = events.filter( event => new Date( event.date ).getTime() > now );
        sortEvents( futureEvents );
        res.json( futureEvents );
    }).catch( () => {
        res.status(404).json( {error: 'Oops! Events not found.'} );
    });
});

router.get('/users/current/hunts/history', tokenMiddleware, async (req, res) => {
    const userId = req.user.id;
    UserDAO.getUserEvents(userId).then( events => {
        let now = new Date();
        now.setHours(now.getHours() + 6);
        now = now.getTime();
        let pastEvents = events.filter( event => new Date( event.date ).getTime() < now );
        sortEvents( pastEvents );
        res.json( pastEvents );
    }).catch(() => {
        res.status(404).json( {error: 'Oops! Events not found.'} );
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

//active hunt functionality
router.put('/currentuser/hunt', tokenMiddleware, (req, res) => {
    const userId = req.user.id;
    const ticketId = req.body.ticketId;
    if ( ticketId ) {
        UserDAO.setActiveTicket(userId, ticketId).then(ticket => {
            res.json(ticket);
        }).catch( () => {
            res.status( 401 ).json( {error: 'Oops! Not authenticated.'} );
        });
    }
    else
        res.status( 404 ).json( {error: 'Oops! Invalid request.'} );
});

router.put('/currentuser/settings', tokenMiddleware, (req, res) => {
    UserDAO.updateSettings( req.user.id, req.body ).then( user => {
        res.json( user );
    }).catch( err => {
        res.status( 500 ).json( {error: err.message} );
    });
});

module.exports = router;

function sortEvents(events) {
    return events.sort(timeComparator);
}

function timeComparator(a, b) {
    let d1 = new Date(a.date);
    let d2 = new Date(b.date);

    return d1.getTime() - d2.getTime();
}

// function upcoming(date) {
//     let d1 = new Date(date);
//     d1.setHours(d1.getHours() + 6);

//     let d2 = new Date();

//     return (d1 >= d2);
// }

// function past(date) {
//     return !upcoming(date);
// }