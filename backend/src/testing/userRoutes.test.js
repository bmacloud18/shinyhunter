import request from 'supertest';
import express from 'express';
import userRoutes from '../routes/userRoutes';
import {log, error} from 'console';


const TOKEN_COOKIE_NAME = 'ShinyHunter';

const mock = express();
mock.use(express.json());
mock.use(userRoutes);

const userInfo = {
    username: 'mockuser',
    password: 'mockpass',
    first_name: 'mockfirst',
    last_name: 'mocklast'
}

const loginInfo = {
    username: 'mockuser',
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
    const del = await request(mock).delete('/users/updateuser')
        .set('Cookie', [`${TOKEN_COOKIE_NAME}=${token}`]);
    expect(del.statusCode).toBe(200);
    expect(JSON.parse(del.text)).toBe('user deleted');

    //make sure cookies are deleted through logout
    const res = await request(mock).post('/logout');
    expect(res.statusCode).toBe(200);

});

const update_data = {
    username: 'updateuser',
    first_name: 'update',
    last_name: 'update',
    avatar: 'update'
}

const pass_data = {
    password: 'mockpass',
    new_password: 'updatepass'
}

test('user test', async () => {
    const g = await (request(mock).get(`/users/${usr_id}`))
        .set('Cookie', [`${TOKEN_COOKIE_NAME}=${token}`]);
    expect(g.statusCode).toBe(200);
    expect(g.body.username).toBe('mockuser');

    const up = await (request(mock).put('/currentuser'))
        .set('Cookie', [`${TOKEN_COOKIE_NAME}=${token}`])
        .set('Accept', 'application/json')
        .send(update_data);
    expect(up.statusCode).toBe(200);
    expect(up.body.username).toBe('updateuser');

    const pass = await (request(mock).put('/currentuser/password'))
        .set('Cookie', [`${TOKEN_COOKIE_NAME}=${token}`])
        .set('Accept', 'application/json')
        .send(pass_data);
    expect(pass.statusCode).toBe(200);
    expect(JSON.parse(pass.text)).toBe('updateuser updated');
});