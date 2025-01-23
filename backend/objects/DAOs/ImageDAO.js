import {query} from '../DBConnection.js';
import Image from '../models/Image.js';

async function getImage(path) {
    return query(`SELECT * FROM images WHERE img_path=?`, [path]).then(({results}) => {
        if (results[0] === undefined) {
            return undefined;
        }
        const image = new Image(results[0]);
        if (image) {
            return image;
        }
        else {
            return ('image not found');
        }
    }).catch((err) => {
        console.log(err.message);
        return undefined;
    })
};

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