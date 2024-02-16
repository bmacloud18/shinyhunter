import {query} from '../DBConnection.js';
import Hunt from '../models/Hunt.js';

//unfinished
function validateDate(date_string) {
    if (date_string == null) {
        throw new Error("Oops! couldn't complete hunt");
    }

    return date_string;
}

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
async function createNewHunt(user, pokemon, game, method, start_date_string, end_date_string, count, increment, charm, nickname) {
    return query('INSERT INTO hunt (usr_id, pkm_name, gam_name, mtd_id, hnt_start_date_string, hnt_end_date_string, hnt_count, hnt_inc, htn_charm, hnt_nnm VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
    [user, pokemon, game, method, start_date_string, end_date_string, count, increment, charm, nickname]).then(({results}) => {
        if (results.insertId) {
            return getHuntById(results.insertId);
        }
    });
};

//complete an active hunt by providing it with an end date
async function completeHunt(id, end_date) {
    const end_date_string = validateEndDate(end_date)

    return query ('UPDATE hunt SET end_date_string=? WHERE hnt_id=?', [end_date_string, id]).then(({results}) => {
        return results;
    }).catch( () => {
        throw new Error("Oops! couldn't complete hunt");
    })
};

//update a hunt by providing it with hunt settings data
async function updateHunt(id, start_date, count, increment, nickname) {
    const start_date_string = validateDate(start_date);

    return query ('UPDATE hunt SET start_date_string=?, count=?, increment=?, nickname=? WHERE id=?', [start_date_string, count, increment, nickname, id]).then(({results}) => {
        return results;
    }).catch( () => {
        throw new Error("Oops! couldn't update hunt");
    })
}

export default {
    getHuntById,
    getHuntsByUser,
    createNewHunt,
    completeHunt,
    updateHunt
};