// const jwt = require('jsonwebtoken');
import jwt from 'jsonwebtoken';
// cookie name
const TOKEN_COOKIE_NAME = 'ShinyHunter';

// get the api secret
const API_SECRET = process.env.API_SECRET_KEY;

const session_time = 24 * 60 * 60 * 1000;

// token middleware
const tokenMiddleware = (req, res, next) => {
    let token = req.cookies[ TOKEN_COOKIE_NAME ];
    // do we have a cookie?
    if ( !token ) {
        // do we have a token?
        const authHeader = req.get( 'Authorization' );
        if ( authHeader?.startsWith( 'Bearer ' ) )
            token = authHeader.slice( 7 );
        // no token
        else {
            res.status( 404 ).json( {error: 'Oops! Not authenticated.'} );
            return;
        }
    }

    // validate the token
    try {
        const decoded = jwt.verify( token, API_SECRET );
        req.user = decoded.user;
        next();
    }

    // oops! invalid
    catch ( err ) {
        res.status( 403 ).json( {error: 'Oops! Forbidden'} );
    }
};

// new token
const generateToken = (req, res, user) => {
    // store the sanitized user, and token expiration
    let data = {
        user: user,
        exp: Math.floor( Date.now() / 1000 ) + (session_time) 
    };
    
    // sign the token
    const token = jwt.sign( data, API_SECRET );

    // send token
    res.cookie( TOKEN_COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: session_time
    });
};

// remove token
const removeToken = (req, res) => {
    // send cookie
    res.cookie( TOKEN_COOKIE_NAME, '', {
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
        maxAge: -360000 // expired
    });
};

export {
    tokenMiddleware,
    generateToken,
    removeToken
}
