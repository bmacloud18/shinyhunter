// const query = require('../DBConnection.js').query;
// const Hunt = require('../models/Hunt');

import {query} from '../DBConnection.js';
import Hunt from '../models/Hunt.js';

//unfinished
// function validateEndDate(date_string) {
//     if (date_string == null) {
//         throw new Error("Oops! couldn't complete hunt");
//     }

//     return date_string;
// }

// function validateStartDate(date_string) {
//     if (date_string == null) {
//         throw new Error("Oops! couldn't complete hunt");
//     }

//     return date_string;
// }

//get all hunts
async function getAllHunts() {
    return query('SELECT * FROM hunt').then(({results}) => {
        const hunts = results.map(h => new Hunt(h));
        if (hunts.length > 0) {
            return hunts;
        }
        else {
            throw new Error("No Hunts Found");
        }
    });
};

//get hunt by id
async function getHuntById(id) {
    return query('SELECT * FROM hunt WHERE hnt_id=?', [id]).then(({results}) => {
        const hunt = new Hunt(results[0]);
        if (hunt) {
            return hunt;
        }
        else {
            throw new Error("Hunt not found");
        }
    });
};

//get user hunts by user's id
async function getHuntsByUser(user_id) {
    return query('SELECT * FROM hunt WHERE usr_id=?', [user_id]).then(({results}) => {
        const hunts = results.map(h => new Hunt(h));
        if (hunts) {
            return hunts;
        }
        else {
            throw new Error("No Hunts Found");
        }
    });
};

//create new hunt, leave end_date_string null if hunt is active
async function createNewHunt(user, pokemon, game, method, start_date, end_date, time, count, increment, charm, nickname, sprite) {
    let start_date_string;
    let end_date_string;
    if (start_date != null) {
        start_date_string = new Date(start_date).toISOString();
    }
    if (end_date != null) {
        end_date_string = new Date(end_date).toISOString();
    }

    return query('INSERT INTO hunt (pkm_name, usr_id, gam_name, mtd_id, hnt_start_date_string, hnt_end_date_string, hnt_time_s, hnt_count, hnt_inc, hnt_charm, hnt_nnm, pkm_sprite) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
    [pokemon, user, game, method, start_date_string, end_date_string, time, count, increment, charm, nickname, sprite]).then(({results}) => {
        if (results.insertId) {
            return getHuntById(results.insertId);
        }
    }).catch( (err) => {
        console.log(err.message);
        throw new Error("Oops! error occurred: " + err.message);
    });
};

//complete an active hunt by providing it with an end date
async function completeHunt(id, end_date) {
    const end_date_string = new Date(end_date).toISOString();

    return query('UPDATE hunt SET hnt_end_date_string=? WHERE hnt_id=?', [end_date_string, id]).then((results) => {
        return getHuntById(id);
    }).catch( () => {
        throw new Error("Oops! couldn't complete hunt");
    });
};

//update a hunt by providing it with hunt settings data
async function updateHuntSettings(id, time, count, increment, charm, nickname) {
    return query('UPDATE hunt SET hnt_time_s=?, hnt_count=?, hnt_inc=?, hnt_charm=?, hnt_nnm=? WHERE hnt_id=?', [time, count, increment, charm, nickname, id]).then(({results}) => {
        return results;
    }).catch(err => {
        console.log(err.message);
        throw new Error(err.message +  ': error updating hunt');
    });
}

//update a hunt after hunting progress
async function updateHunt(id, time, count) {
    return query('UPDATE hunt SET hnt_time_s=?, hnt_count=? WHERE hnt_id=?', [time, count, id]).then(({results}) => {
        return results;
    }).catch(err => {
        console.log(err.message);
        throw new Error(err.message +  ': error updating hunt');
    });
}

async function deleteHunt(id) {
    return query('DELETE FROM hunt WHERE hnt_id=?', [id]).then(({results}) => {
        return 'hunt deleted';
    }).catch(err => {
        console.log(err.message);
        throw new Error(err.message +  ': error deleting hunt');
    });
}

export {
    getAllHunts,
    getHuntById,
    getHuntsByUser,
    createNewHunt,
    completeHunt,
    updateHuntSettings,
    updateHunt,
    deleteHunt
};