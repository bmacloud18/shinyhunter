import express from 'express';
import cookieParser from 'cookie-parser';
const router = express.Router();
router.use(cookieParser());
router.use(express.json());
import HuntDAO from '../../objects/DAOs/HuntDAO.js';
import {tokenMiddleware} from '../middleware/tokenMiddleware.js';


router.get('/hunt/:id', tokenMiddleware, (req, res) => {
    const huntId = req.params.id;
    HuntDAO.getHuntById(huntId).then(hunt => {
        res.json(hunt);
    });
});

export default router;