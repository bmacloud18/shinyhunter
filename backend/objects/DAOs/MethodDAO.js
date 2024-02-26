import {query} from '../DBConnection.js';
import Method from '../models/Method.js';

//get all methods
async function getAllMethods() {
    return query('SELECT * FROM method').then(({results}) => {
        const methods = results.map(m => new Method(m));
        if (methods.length > 0) {
            return methods;
        }
        else {
            throw new Error("No Methods Found");
        }
    });
};

//get method by id
async function getMethodById(id) {
    return query('SELECT * FROM method WHERE mtd_id=?', [id]).then(({results}) => {
        const method = new Method(results[0]);
        if (method) {
            return method;
        }
        else {
            throw new Error("Method not found");
        }
    });
};

export {
    getAllMethods,
    getMethodById
};