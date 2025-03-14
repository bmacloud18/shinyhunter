import express from 'express';
import cookieParser from 'cookie-parser';
import {tokenMiddleware} from '../middleware/tokenMiddleware.js';
import * as ImageDAO from '../../objects/DAOs/ImageDAO.js';

const router = express.Router();
router.use(cookieParser());
router.use(express.json());

router.get('/images/uploads/:filename', tokenMiddleware, (req, res) => {
    const filename = req.params.filename;
    
    ImageDAO.getImage(filename).then(image => {
        if (image)
            res.json('found image');
    });
});

router.post('/images', tokenMiddleware, (req, res) => {
    const filename = req.body.filename;

    ImageDAO.uploadImage(filename).then(result => {
        res.json('image uploaded');
    }).catch((err) => {
        res.status(404).json({error: 'error uploading image: ' + err.message});
    });
});

router.delete('/images/uploads/:filename', tokenMiddleware, (req, res) => {
    const filename = req.params.filename;

    ImageDAO.deleteImage(filename).then(msg => {
        console.log('image deleted');
    });
});


export default router;