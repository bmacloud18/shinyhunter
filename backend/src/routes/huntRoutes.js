const express = require('express');
const cookieParser = require('cookie-parser');
const router = express.Router();
router.use(cookieParser());
router.use(express.json());

const HuntDAO = require('../../objects/DAOs/HuntDAO.js')
const {tokenMiddleware} = require('../middleware/tokenMiddleware.js');

//get a hunt by its id
router.get('/hunt/:id', tokenMiddleware, (req, res) => {
    const huntId = req.params.id;

    HuntDAO.getHuntById(huntId).then(hunt => {
        res.json(hunt);
    });
});

//get a user's hunts by the user's id
router.get('/hunt/users/id/:id', tokenMiddleware, (req, res) => {
    const userId = req.params.id;

    HuntDAO.getHuntsByUser(userId).then(hunts => {
        res.json(sortHunts(hunts));
    });
});

//get the currently logged in user's hunts
router.get('/hunt/users/current', tokenMiddleware, (req, res) => {
    const userId = req.user.id;

    HuntDAO.getHuntsByUser(userId).then(hunts => {
        res.json(sortHunts(hunts));
    });
});

//create a new hunt. all hunts are posted to the same endpoint, and differentiated
//by whether or not the end_date_string is null (active if null)
router.post('/hunt', tokenMiddleware, (req, res) => {

    const userId = req.user.id;
    const pkm = req.body.pkm;
    const game = req.body.game;
    const method = req.body.method;
    const start_date = req.body.start_date;
    const increment = req.body.increment;
    const charm = req.body.charm;
    const nickname = req.body.nickname;

    HuntDAO.createNewHunt(userId, pkm, game, method, start_date, end_date, count, increment, charm, nickname).then(hunt => {
        res.json(hunt);
    }).catch(() => {
        res.status(401).json({error: 'error creating hunt'});
    })

});

//hit this endpoint to complete an active hunt by adding an end_date_string to the hunt 
//denoted by the id param. the end date cannot be editted once a hunt is complete
router.put('/hunt/:id/complete', tokenMiddleware, (req, res) => {
    const end_date = req.body.end_date;
    const huntId = req.params.id;

    HuntDAO.completeHunt(huntId, end_date).then(hunt => {
        res.json(hunt);
    }).catch(() => {
        res.status(401).json({error: 'error creating hunt'});
    })
});

router.put('/hunt/:id', tokenMiddleware, (req, res) => {
    
    const huntId = req.params.id;
    const pkm = req.body.pkm;
    const game = req.body.game;
    const method = req.body.method;
    const start_date = req.body.start_date;
    const increment = req.body.increment;
    const charm = req.body.charm;
    const nickname = req.body.nickname;

    HuntDAO.updateHunt(huntId, pkm, game, method, start_date, end_date, count, increment, charm, nickname).then(hunt => {
        res.json(hunt);
    }).catch(() => {
        res.status(401).json({error: 'error updating hunt'});
    })
});


//sorts hunts by date
function sortHunts(hunts) {
    return hunts.sort(timeComparator);
}

//sort helper
function timeComparator(a, b) {
    let d1 = new Date(a.start_date_string);
    let d2 = new Date(b.start_date_string);

    return d1.getTime() - d2.getTime();
}

module.exports = router;