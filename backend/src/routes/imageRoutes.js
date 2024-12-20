import express from 'express';
import cookieParser from 'cookie-parser';
import {tokenMiddleware} from '../middleware/tokenMiddleware.js';
import * as ImageDAO from '../../objects/DAOs/ImageDAO.js';

const router = express.Router();
router.use(cookieParser());
router.use(express.json());

router.get('/images/:path', tokenMiddleware, (req, res) => {
    const path = req.params.path;
    
    ImageDAO.getImage(path).then(image => {
        res.json(image);
    })
});

router.post('/images', tokenMiddleware, (req, res) => {
    const path = req.body.path;

    ImageDAO.uploadImage(path).then(result => {
        res.json('upload successful');
    }).catch((err) => {
        res.status(404).json({error: 'error uploading image path: ' + err.message});
    });
});

router.delete('/images/:path', tokenMiddleware, (req, res) => {
    const path = req.params.path;

    ImageDAO.deleteImage(path).then(msg => {
        console.log('image deleted');
    });
});


export default router;