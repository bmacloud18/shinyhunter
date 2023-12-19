import {query} from '../DBConnection.js';
import User from '../models/User.js';
import Hunt from '../models/Hunt.js';
import Pokemon from '../models/Pokemon.js';

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
}

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
}

export default {
    getHuntById,
    getHuntsByUser
};