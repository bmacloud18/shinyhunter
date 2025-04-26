import {query} from '../DBConnection.js';
import Image from '../models/Image.js';

async function getImage(filename) {
    return query(`SELECT * FROM images WHERE img_name=?`, [filename]).then(({results}) => {
        if (results[0] === undefined) {
            return undefined;
        }
        const image = new Image(results[0]);
        if (image) {
            return 'found image';
        }
        else {
            return ('image not found');
        }
    }).catch((err) => {
        console.log(err.message);
        return undefined;
    })
};

//checks with getImage first to see if the image already exists
//just realized this wouldn't really be practical as filenames don't indicate
//the contents of an image, but we're gonna go with it for now. maybe could change
//to also check or save the user id of the poster, can update later.
//may need to also change the way images are saved and retrieved in the backend.
//(need to concat the img_id with the filename for the api route most likely)
async function uploadImage(filename) {
    const response = await getImage(filename);

    if (response === undefined) {
        console.log(filename);
        return query(`INSERT INTO images (img_name) VALUES (?)`, [filename]).then(({results}) => {
            if (results.insertId) {

                return results;
            }
        }).catch( (err) => {
            console.log(err.message);
            throw new Error("Oops! error occurred: " + err.message);
        });
    }

    return ("image already exists");
};

async function deleteImage(filename) {
    return query('DELETE FROM images WHERE img_name=?', [filename]).then(({res}) => {
        return 'image deleted successfully'
    }).catch(err => {
        console.log(err.message);
        throw new Error(err.message +  ': error deleting image');
    });
};

export {
    getImage,
    uploadImage,
    deleteImage
}