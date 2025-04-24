import request from 'supertest';
import express from 'express';
import userRoutes from '../routes/userRoutes';
import pokemonRoutes from '../routes/pokemonRoutes';
import jwt from 'jsonwebtoken';
import {log, error} from 'console';
import {tokenMiddleware, generateToken, removeToken} from '../middleware/tokenMiddleware.js';

const API_SECRET = process.env.API_SECRET_KEY;
const session_time = 1000;

const mock = express();
mock.use(express.json());
mock.use(pokemonRoutes);
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

let data = {
    user: userInfo,
    exp: Math.floor( Date.now() / 1000 ) + (session_time)
};

// sign the token
const token = jwt.sign( data, API_SECRET );

beforeAll( async () => {

    


    const res = await request(mock).post('/register').send(userInfo).set('Accept', 'application/json');
    expect(res.statusCode).toBe(200);
    const login = await request(mock).post('/login').send(loginInfo).set('Accept', 'application/json');
    expect(login.statusCode).toBe(200);
    const check = await request(mock).get('/currentuser').set('Authorization', `Bearer ${token}`);
    log(check)
    expect(check.statusCode).toBe(200);
});

afterAll( async () => {
    const login = await request(mock).post('/login').send(loginInfo).set('Accept', 'application/json');
    expect(login.statusCode).toBe(200);
    const del = await request(mock).delete('/users/mockuser');
    expect(del).toBe('user deleted');
    const res = await request(mock).post('/logout').set('Accept', 'application/json');
    expect(res.statusCode).toBe(200);
});

test('new test', async () => {
    const ret = await (request(mock).get('/pokemon/name/1'));
    expect(ret).toBe("bulbasaur");
});;