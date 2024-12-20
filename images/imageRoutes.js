const express = require( 'express' );
const router = express.Router();

router.use(express.static('static'));
router.use(express.urlencoded({extended: true}));

const fs = require('fs');
const path = require('path');
// const gm = require('gm').subClass({ imageMagick: true });
const upload_path = path.join(__dirname, './uploads')
const sprite_path = path.join(__dirname, './sprites');

const multer = require('multer');
let mstorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, upload_path);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({storage: mstorage});

// // Middleware to resize images to a square format
// function resizeToSquare(req, res, next) {
//     if (!req.file) {
//         return next();
//     } 
    
//     // Define the desired square dimensions
//     const squareSize = 300; // Adjust according to your requirements
    
//     // Resize image to square format using sharp
//     gm(req.file.path)
//         .resize(squareSize, squareSize, '^')
//         .gravity('Center')
//         .crop(squareSize, squareSize)
//         .write(path.join(upload_path, req.file.filename), (err) => {
//             if (err) return next(err);
//             next();
//         });
// }

//return the actual image material data in server filesystem
router.get('/uploads/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(upload_path, filename);

    fs.stat(filePath, (err, stat) => {
        if (err) {
            res.status(404).send('File not found');
            return;
        }

        res.sendFile(filePath);
    });
});

//check to see if image exists, if id returned then image exists
//used by api client
router.get('/uploads/string/:filename', (req, res) => {
    const filename = req.params.filename;
    const image_path = '/images/uploads/' + filename;
    return query('SELECT * FROM images WHERE img_path=?', [image_path]).then(({results}) => {
        if (results.length > 0) {
            const image = results[0];
            return image.id;
        }
        
        return -3;
    })
});

router.get('/sprites/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(sprite_path, filename);

    fs.stat(filePath, (err, stat) => {
        if (err) {
            res.status(404).send('File not found');
            return;
        }

        res.sendFile(filePath);
    });
});

router.post('/uploads/', upload.single('pfp'), (req, res) => {
    const filename = req.file.originalname;
    const image_path = '/images/uploads/' + filename;
    if (req.file.mimetype.substring(0, 5) != 'image') {
        const filePath = image_path + filename;
        fs.unlink(filePath, (err) => {
            throw new Error('Error deleting file after post: ' + err.message);
        });
    }

    //let the database know the image exists
    return query('INSERT INTO image(img_path) VALUES (?)', [image_path]).then(({results}) => {
        if (results.insertId) {
            return image_path;
        }
        else throw new Error('Error with sql insert');
    }).catch((err) => {
        console.log(err.message);
        throw new Error("Oops! error occurred: " + err.message);
    });
});

router.delete('/uploads/:filename', (req, res) => {
    const filename = req.params.filename;
    const image_path = '/images/uploads/' + filename;
    const filePath = path.join(upload_path, filename);
    fs.unlink(filePath, () => {
        return query('DELETE FROM images WHERE img_path=?', [image_path]).then(({results}) => {
            return 'image deleted';
        }).catch(err => {
            console.log(err.message);
            throw new Error(err.message + ': error deleting image');
        });
    });
});


module.exports = router;