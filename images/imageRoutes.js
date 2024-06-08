const express = require( 'express' );
const router = express.Router();

router.use(express.static('static'));
router.use(express.urlencoded({extended: true}));

const fs = require('fs');
const path = require('path');
// const gm = require('gm').subClass({ imageMagick: true });
const image_path = path.join(__dirname, './uploads')
const sprite_path = path.join(__dirname, './sprites');

const multer = require('multer');
let mstorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, image_path);
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
//         .write(path.join(image_path, req.file.filename), (err) => {
//             if (err) return next(err);
//             next();
//         });
// }

router.get('/uploads/:filename', (req, res) => {
    const name = req.params.filename;
    const filePath = path.join(image_path, name);

    fs.stat(filePath, (err, stat) => {
        if (err) {
            res.status(404).send('File not found');
            return;
        }

        res.sendFile(filePath);
    });
});

router.get('/sprites/:filename', (req, res) => {
    const name = req.params.filename;
    const filePath = path.join(sprite_path, name);

    fs.stat(filePath, (err, stat) => {
        if (err) {
            res.status(404).send('File not found');
            return;
        }

        res.sendFile(filePath);
    });
});

router.post('/uploads/', upload.single('pfp'), (req, res) => {
    console.log(req.file);
    if (req.file.mimetype.substring(0, 5) != 'image') {
        const filePath = image_path + req.file.originalname;
        fs.unlink(filePath, (err) => {
            throw new Error('Error deleting file after post: ' + err.message);
        });
    }
    res.json('image uploaded');
});

router.delete('/uploads/:filename', (req, res) => {
    const name = req.params.filename;
    const filePath = path.join(image_path, name);
    fs.unlink(filePath, () => {
        res.json('Image deleted');
    });
});


module.exports = router;