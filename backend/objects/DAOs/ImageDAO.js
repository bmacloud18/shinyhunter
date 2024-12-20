import {query} from '../DBConnection.js';
import Image from '../models/Image.js';

async function getImage(path) {
    return query(`SELECT * FROM images WHERE img_path=?`, [path]).then(({results}) => {
        const image = new Image(results[0]);
        if (image) {
            return image;
        }
    })
};

async function uploadImage(path) {
    return query(`INSERT INTO images (img_path) VALUES (?)`, [path]).then(({results}) => {
        if (results.insertId) {
            return results;
        }
    }).catch( (err) => {
        console.log(err.message);
        throw new Error("Oops! error occurred: " + err.message);
    });
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