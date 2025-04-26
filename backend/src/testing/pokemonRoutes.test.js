import request from 'supertest';
import express from 'express';
import userRoutes from '../routes/userRoutes';
import pokemonRoutes from '../routes/pokemonRoutes';
import {log, error} from 'console';


const TOKEN_COOKIE_NAME = 'ShinyHunter';

const mock = express();
mock.use(express.json());
mock.use(userRoutes);
mock.use(pokemonRoutes);

const userInfo = {
    username: 'mockpkm',
    password: 'mockpass',
    first_name: 'mockfirst',
    last_name: 'mocklast'
}

const loginInfo = {
    username: 'mockpkm',
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
    const del = await request(mock).delete('/users/mockpkm')
        .set('Cookie', [`${TOKEN_COOKIE_NAME}=${token}`]);
    expect(del.statusCode).toBe(200);
    expect(JSON.parse(del.text)).toBe('user deleted');

    //make sure cookies are deleted through logout
    const res = await request(mock).post('/logout');
    expect(res.statusCode).toBe(200);

});
test('pokemon test (external api)', async () => {
    const ret = await (request(mock).get('/pokemon/name/1')).set('Cookie', [`${TOKEN_COOKIE_NAME}=${token}`]);
    expect(ret.body.name).toBe("bulbasaur");

    const all = await (request(mock).get('/pokemon')).set('Cookie', [`${TOKEN_COOKIE_NAME}=${token}`]);
    expect(all.statusCode).toBe(200);
});