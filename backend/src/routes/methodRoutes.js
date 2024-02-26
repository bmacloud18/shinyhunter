import express from 'express';
import cookieParser from 'cookie-parser';
import {tokenMiddleware} from '../middleware/tokenMiddleware.js';
import * as MethodDAO from '../../objects/DAOs/MethodDAO.js';

const router = express.Router();
router.use(cookieParser());
router.use(express.json());

//get all methods
router.get('/method', tokenMiddleware, (req, res) => {
    MethodDAO.getAllMethods().then(methods => {
        res.json(methods);
    });
});

//get a method by its id
router.get('/method/:id', tokenMiddleware, (req, res) => {
    const methodId = req.params.id;

    MethodDAO.getMethodById(methodId).then(method => {
        res.json(method);
    });
});

export default router;