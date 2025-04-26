import request from 'supertest';
import express from 'express';
import userRoutes from '../routes/userRoutes';
import * as huntRoutes from '../routes/huntRoutes.js';
import {log, error} from 'console';


const TOKEN_COOKIE_NAME = 'ShinyHunter';

const mock = express();
mock.use(express.json());
mock.use(huntRoutes.router);
mock.use(huntRoutes.updateRouter);
mock.use(userRoutes);

const userInfo = {
    username: 'mockhunt',
    password: 'mockpass',
    first_name: 'mockfirst',
    last_name: 'mocklast'
}

const loginInfo = {
    username: 'mockhunt',
    password: 'mockpass'
}


let token;
let usr_id;

beforeAll( async () => {
    //create mock test user
    const res = await request(mock).post('/register').send(userInfo).set('Accept', 'application/json');
    expect(res.statusCode).toBe(200);
    //login with mock user
    const login = await request(mock).post('/login').send(loginInfo).set('Accept', 'application/json');
    expect(login.statusCode).toBe(200);

    usr_id = login.body.id;

    //extract cookie from login
    const cookies = res.headers['set-cookie'];
    const tokenCookie = cookies.find(c => c.startsWith(`${TOKEN_COOKIE_NAME}=`));
    token = tokenCookie.split(';')[0].split('=')[1];

    //ensure authenticated routes can be hit
    const check = await request(mock).get('/currentuser').set('Cookie', [`${TOKEN_COOKIE_NAME}=${token}`]);
    expect(check.statusCode).toBe(200);
});

afterAll( async () => {

    //remove mock user from db
    const del = await request(mock).delete('/users/mockuser').set('Cookie', [`${TOKEN_COOKIE_NAME}=${token}`]);
    expect(del.statusCode).toBe(200);
    expect(JSON.parse(del.text)).toBe('user deleted');

    //make sure cookies are deleted through logout
    const res = await request(mock).post('/logout');
    expect(res.statusCode).toBe(200);

});

test('new test', async () => {
    log('testing');
    const ret = await (request(mock).get('/hunt'))
        .set('Cookie', [`${TOKEN_COOKIE_NAME}=${token}`]);
    expect(ret.statusCode).toBe(200);

    log('hunt retrieved');

    const sample1 = {
        userId: usr_id,
        pkm: 'litten',
        game: 'sun',
        method: 9,
        start_date: '2025-05-14T04:39:36.778Z',
        end_date: null,
        time: 500,
        count: 25,
        increment: 5,
        charm: 'on',
        nickname: 'sample1',
        sprite: '/images/sprites/725.png'
    }

    

    const newh = await (request(mock).post('/hunt')).send(sample1)
        .set('Accept', 'application/json')
        .set('Cookie', [`${TOKEN_COOKIE_NAME}=${token}`]);
    expect(newh.statusCode).toBe(200);
    expect(newh.body.pkm).toBe('litten');

    log('litten hunt started');
    
    const hunt_id = newh.body.id;

    log(hunt_id);


    const delh = await (request(mock).delete(`/hunt/${hunt_id}`))
        .set('Cookie', [`${TOKEN_COOKIE_NAME}=${token}`]);
    expect(delh.statusCode).toBe(200);

    log('litten hunt deleted');
});;