import request from 'supertest';
import express from 'express';
import userRoutes from '../routes/userRoutes';
import * as huntRoutes from '../routes/huntRoutes';
import {log, error} from 'console';


const TOKEN_COOKIE_NAME = 'ShinyHunter';

const mock = express();
mock.use(express.json());
mock.use(userRoutes);
mock.use(huntRoutes.router);
mock.use(huntRoutes.updateRouter);

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
    const res = await request(mock).post('/register')
        .send(userInfo)
        .set('Accept', 'application/json');
    expect(res.statusCode).toBe(200);
    //login with mock user
    const login = await request(mock).post('/login')
        .send(loginInfo)
        .set('Accept', 'application/json');
    expect(login.statusCode).toBe(200);

    usr_id = login.body.id;

    //extract cookie from login
    const cookies = res.headers['set-cookie'];
    const tokenCookie = cookies.find(c => c.startsWith(`${TOKEN_COOKIE_NAME}=`));
    token = tokenCookie.split(';')[0].split('=')[1];

    //ensure authenticated routes can be hit
    const check = await request(mock).get('/currentuser')
        .set('Cookie', [`${TOKEN_COOKIE_NAME}=${token}`]);
    expect(check.statusCode).toBe(200);
});

afterAll( async () => {

    //remove mock user from db
    const del = await request(mock).delete('/users/mockhunt')
        .set('Cookie', [`${TOKEN_COOKIE_NAME}=${token}`]);
    expect(del.statusCode).toBe(200);
    expect(JSON.parse(del.text)).toBe('user deleted');

    //make sure cookies are deleted through logout
    const res = await request(mock).post('/logout');
    expect(res.statusCode).toBe(200);

});
test('new test', async () => {
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

    

    const newh = await (request(mock).post('/hunt'))
        .send(sample1)
        .set('Accept', 'application/json')
        .set('Cookie', [`${TOKEN_COOKIE_NAME}=${token}`]);
    expect(newh.statusCode).toBe(200);
    expect(newh.body.pkm).toBe('litten');

    log('litten hunt started');
    
    const hunt_id = newh.body.id;

    const newh2 = await (request(mock).post('/hunt'))
        .send(sample1)
        .set('Accept', 'application/json')
        .set('Cookie', [`${TOKEN_COOKIE_NAME}=${token}`]);
    expect(newh.statusCode).toBe(200);
    expect(newh.body.pkm).toBe('litten'); 

    const hunt_id2 = newh2.body.id;

    const settings_data = {
        id: hunt_id,
        time: 5050,
        count: 2525,
        increment: 1,
        charm: 'off',
        nickname: 'settings'
    }

    const settings = await (request(mock).put(`/hunt/settings/${hunt_id}`))
        .send(settings_data)
        .set('Cookie', [`${TOKEN_COOKIE_NAME}=${token}`]);
    
    expect(settings.statusCode).toBe(200);
    expect(settings.body.affectedRows).toBe(1);


    
    const today = new Date().toISOString();
    const end_data = {
        end_date: today
    }


    const comp = await (request(mock).put(`/hunt/complete/${hunt_id}`))
        .send(end_data)
        .set('Cookie', [`${TOKEN_COOKIE_NAME}=${token}`]);
    expect(comp.statusCode).toBe(200);


    log('litten hunt completed');

    const get = await (request(mock).get(`/hunt/${hunt_id}`))
        .set('Cookie', [`${TOKEN_COOKIE_NAME}=${token}`]);
    expect(get.statusCode).toBe(200);
    expect(get.body.count).toBe(2525);

    const getAll = await (request(mock).get(`/hunt/users/current`))
        .set('Cookie', [`${TOKEN_COOKIE_NAME}=${token}`]);
    expect(getAll.statusCode).toBe(200);
    expect(getAll.body.length > 1)

    const delh = await (request(mock).delete(`/hunt/${hunt_id}`))
        .set('Cookie', [`${TOKEN_COOKIE_NAME}=${token}`]);
    expect(delh.statusCode).toBe(200);

    const delh2 = await (request(mock).delete(`/hunt/${hunt_id2}`))
        .set('Cookie', [`${TOKEN_COOKIE_NAME}=${token}`]);
    expect(delh.statusCode).toBe(200);

    log('litten hunt deleted');
});;