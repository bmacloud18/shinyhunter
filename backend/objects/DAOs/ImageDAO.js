import {query} from '../DBConnection.js';
import Image from '../models/Image.js';

async function getImage(path) {
    return query(`SELECT * FROM images WHERE img_path=?`, [path]).then(({results}) => {
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
//(need to concat the img_id with the path for the api route most likely)
async function uploadImage(path) {
    const response = await getImage(path);
    console.log(response);
    if (response === undefined) {
        console.log(path);
        return query(`INSERT INTO images (img_path) VALUES (?)`, [path]).then(({results}) => {
            if (results.insertId) {
                console.log(results.insertId);
                return results;
            }
        }).catch( (err) => {
            console.log(err.message);
            throw new Error("Oops! error occurred: " + err.message);
        });
    }

    return ("image already exists");
};

async function deleteImage(path) {
    return query('DELETE FROM images WHERE img_path=?', [image_path]).then(({results}) => {
        return res.json({message: 'Image deleted successfully'});
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