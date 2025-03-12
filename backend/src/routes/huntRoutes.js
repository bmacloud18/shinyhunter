import express from 'express';
import cookieParser from 'cookie-parser';
import {tokenMiddleware} from '../middleware/tokenMiddleware.js';
import * as HuntDAO from '../../objects/DAOs/HuntDAO.js';

const router = express.Router();
router.use(cookieParser());
router.use(express.json());

const updateRouter = express.Router();
updateRouter.use(express.text());

//get all hunts
router.get('/hunt', tokenMiddleware, (req, res) => {
    HuntDAO.getAllHunts().then(hunts => {
        res.json(sortHunts(hunts));
    });
});

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

    const userId = req.body.userId;
    const pkm = req.body.pkm;
    const game = req.body.game;
    const method = req.body.method;
    const start_date = req.body.start_date;
    const end_date = req.body.end_date;
    const time = req.body.time;
    const count = req.body.count;
    const increment = req.body.increment;
    const charm = req.body.charm == 'on' ? 1 : 0;
    const nickname = req.body.nickname;
    const sprite = req.body.sprite;

    

    HuntDAO.createNewHunt(userId, pkm, game, method, start_date, end_date, time, count, increment, charm, nickname, sprite).then(hunt => {
        res.json(hunt);
    }).catch((err) => {
        res.status(404).json({error: 'error creating hunt' + err.message});
    })

});

//hit this endpoint to complete an active hunt by adding an end_date_string to the hunt 
//denoted by the id param. the end date cannot be editted once a hunt is complete
router.put('/hunt/complete/:id', tokenMiddleware, (req, res) => {
    const end_date = req.body.end_date;
    const huntId = req.body.id;

    console.log(end_date, huntId);

    HuntDAO.completeHunt(huntId, end_date).then(hunt => {
        console.log('completing' + hunt);
        res.json(hunt);
    }).catch((e) => {
        throw new Error(e.message);
    })
});

//updates all hunt values
router.put('/hunt/settings/:id', tokenMiddleware, async (req, res) => {
    const huntId = req.params.id;
    const time = req.body.time;
    const count = req.body.count;
    const increment = req.body.increment;
    const charm = req.body.charm;
    const nickname = req.body.nickname;

    HuntDAO.updateHuntSettings(huntId, time, count, increment, charm, nickname).then(hunt => {
        res.json(hunt);
    }).catch(err => {
        res.status(404).json(err.message);
    });
});

//update progress after hunting 
//sendBeacon only sends data in plain text, hence the separate router and custom parsing
updateRouter.post('/hunt/:id', tokenMiddleware, async (req, res) => {
    const huntId = req.params.id;
    const body = req.body.split('\,');
    const time = body[0].split('\:')[1];
    const count = body[1].split('\:')[1];;

    HuntDAO.updateHunt(huntId, time, count).then(hunt => {
        res.json(hunt);
    }).catch(err => {
        res.status(404).json(err.message);
    });
});

router.delete('/hunt/:id', tokenMiddleware, (req, res) => {
    const huntId = req.params.id;

    HuntDAO.deleteHunt(huntId).then(msg => {
        console.log(msg);
    });
});

//sorts hunts by date
function sortHunts(hunts) {
    return hunts.sort(timeComparator);
}

//sort helper
function timeComparator(a, b) {
    let d1 = new Date(a.start_date_string);
    let d2 = new Date(b.start_date_string);

    return d2.getTime() - d1.getTime();
}


export {
    router,
    updateRouter
};