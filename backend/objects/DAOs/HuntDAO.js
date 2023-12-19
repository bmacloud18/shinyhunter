import db from '../DBConnection';
import User from '../models/User';
import Hunt from '../models/Hunt';
import Pokemon from '../models/Pokemon';

async function getHuntById(id) {
    return db.query('SELECT * FROM hunt WHERE hnt_id=?', [id]).then(({results}) => {
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
    return db.query('SELECT * FROM hunt WHERE usr_id=?', [user_id]).then(({results}) => {
        const hunts = results.map(h => new Hunt(h));
        if (hunts) {
            return hunts;
        }
        else {
            throw new Error("No Hunts Found");
        }
    });
}

export {
    getHuntById,
    getHuntsByUser
};