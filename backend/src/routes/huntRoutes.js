const express = require('express');
const cookieParser = require('cookie-parser');
const router = express.Router();
router.use(cookieParser());
router.use(express.json());
const HuntDAO = require('../../objects/DAOs/HuntDAO');
const { tokenMiddleware } = require('../middleware/tokenMiddleware');


router.get('/hunt/:id', tokenMiddleware, (req, res) => {
    const huntId = req.params.id;
    HuntDAO.getHuntById(huntId).then(hunt => {
        res.json(hunt);
    });
});

module.exports = router;