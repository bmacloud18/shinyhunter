// const crypto = require('crypto');
// const query = require('../DBConnection.js').query;
// const User = require('../models/User');

import crypto from 'crypto';
import {query} from '../DBConnection.js';
import User from '../models/User.js';

//get user by username
async function getUser(username) {
    return query('SELECT * FROM user WHERE usr_username=?', [username]).then(({results}) => {
        const user = new User(results[0]);
        if (user) {
            return user;
        }
        else {
            throw new Error("User not found");
        }
    });
};

//get user by id
function getUserById(userId) {
    return query('SELECT * FROM user WHERE usr_id=?', [userId]).then(({results}) => {
        const user = new User(results[0]);
        if (user) {
            return user;
        }
        else {
            throw new Error("User not found");
        }
    });
};

//delete user entirely from DB
async function deleteUser(username) {
    return query('DELETE FROM user WHERE usr_username=?', [username]).then(({res}) => {
        return 'user deleted';
    }).catch(err => {
        console.log(err.message);
        throw new Error(err.message +  ': error deleting hunt');
    });
}

//login
async function login(username, password) {
    return query('SELECT * FROM user WHERE usr_username=?', [username]).then(({results}) => {
        const user = new User(results[0]);
        if (user) {
            return user.validatePassword(password);
        }
        else {
            throw new Error("User not found");
        }
    });
};

//signup
async function signup(user) {
    let newSalt = crypto.randomBytes(64);
    let saltHex = newSalt.toString('hex');

    let computedPassword = await new Promise( (resolve, reject) => {
        crypto.pbkdf2(user.password, saltHex, 100000, 64, 'sha512', (err, derivedKey) => {
            if ( err ) {
                reject( "Error: " + err.message );
                return;
            }

            const digest = derivedKey.toString( 'hex' );
            digest ? resolve( digest ) : reject ( 'Error computing password.' );
        });
    });

    // generate a random avatar
    let randomString = '';
    const validChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let length = Math.floor( Math.random() * 15 ) + 10;
    while ( length-- > 0 )
        randomString += validChars.charAt( Math.floor( Math.random() * validChars.length ) );
    const avatar = `https://robohash.org/${randomString}.png?size=64x64&set=set1&bgset=any`;

    return query('INSERT INTO user (usr_first_name, usr_last_name, usr_username, usr_password, usr_salt, usr_avatar) VALUES (?, ?, ?, ?, ?, ?)',
    [user.first_name, user.last_name, user.username, computedPassword, saltHex, avatar]).then(({results}) => {
        if (results.insertId) {
            return getUserById(results.insertId);
        }
    });
};

async function updateUser(id, updatedUser) {
    return query('UPDATE user SET usr_username=?, usr_first_name=?, usr_last_name=?, usr_avatar=? WHERE usr_id=?', [updatedUser.username, updatedUser.first_name, updatedUser.last_name, updatedUser.avatar, id])
        .then( ({results}) => {
            if ( results.affectedRows == 1 && results.warningCount == 0 )
                return getUserById( id );
            throw new Error( "Oops! Something went wrong." );
        }).catch( () => {
            throw new Error( "Oops! Something went wrong." );
    });
};


//update password
async function updatePassword(id, password, new_password) {
    // validate password
    const user = await query('SELECT * FROM user WHERE usr_id=?', [id]).then(async ({results}) => {
        const user = new User(results[0]);
        if ( user ) {
            const tmpUser = await user.validatePassword( password );
            if ( tmpUser.id !== user.id )
                throw new Error( 'Oops! Invalid password.' );

            return tmpUser;
        }
        throw new Error( 'Oops!. User not found.');
    });
    if ( !user )
        throw new Error( 'Oops! Something went wrong.' );

    // create new salt and hash the password
    const salt = crypto.randomBytes( 64 ).toString( 'hex' );
    const computedPassword = await new Promise( (resolve, reject) => {
        crypto.pbkdf2(new_password, salt, 100000, 64, 'sha512', (err, derivedKey) => {
            if ( err ) {
                reject( "Error: " + err.message );
                return;
            }

            const digest = derivedKey.toString( 'hex' );
            digest ? resolve( digest ) : reject ( 'Error computing password.' );
        });
    });

    // persist the new password and salt
    return query('UPDATE user SET usr_password=?, usr_salt=? WHERE usr_id=?', [computedPassword, salt, id])
        .then( ({results}) => {
            if ( results.affectedRows == 1 && results.warningCount == 0 )
                return getUserById( id );
            throw new Error( "Oops! Something went wrong." );
        }).catch( () => {
            throw new Error( "Oops! Something went wrong." );
    });
};

//update settings
async function updateSettings( id, settings ) {
    if ( !id || settings.dark === undefined || settings.notify === undefined || settings.text === undefined )
        throw new Error( 'Oops! Something went wrong.' );
    return query( 'UPDATE user SET usr_stg_dark=?, usr_stg_notify=?, usr_stg_text=? WHERE usr_id=?', [settings.dark, settings.notify, settings.text, id] ).then( ({results}) => {
        if ( results.affectedRows == 1 && results.warningCount == 0 )
            return getUserById( id );
        throw new Error( 'Oops! Something went wrong.' );
    }).catch( () => {
        throw new Error( 'Oops! Something went wrong.' );
    });
};

// async function search( value ) {
//     const param = `%${value}%`;
//     return query( 'SELECT * FROM event \
//         JOIN venue ON venue.ven_id=event.ven_id \
//         WHERE event.evt_name LIKE ? \
//         OR event.evt_descr LIKE ? \
//         OR venue.ven_name LIKE ? \
//         OR venue.address_city LIKE ?', [param, param, param, param] ).then( ({results}) => {
//             const events = results.map( res => new Event( res ) );
//             if ( !events?.length )
//                 throw new Error( 'Oops!' );
//             return events;
//         }).catch( () => {
//             throw new Error( 'Oops!' );
//         });
// };

export {
    getUser,
    getUserById,
    login,
    signup,
    updateUser,
    updatePassword,
    updateSettings,
    deleteUser
};
