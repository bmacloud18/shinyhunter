import request from 'supertest';
import express from 'express';
import userRoutes from '../routes/userRoutes';
import methodRoutes from '../routes/methodRoutes';
import {log, error} from 'console';


const TOKEN_COOKIE_NAME = 'ShinyHunter';

const mock = express();
mock.use(express.json());
mock.use(userRoutes);
mock.use(methodRoutes);

const userInfo = {
    username: 'mockmtd',
    password: 'mockpass',
    first_name: 'mockfirst',
    last_name: 'mocklast'
}

const loginInfo = {
    username: 'mockmtd',
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
    const del = await request(mock).delete('/users/mockmtd')
        .set('Cookie', [`${TOKEN_COOKIE_NAME}=${token}`]);
    expect(del.statusCode).toBe(200);
    expect(JSON.parse(del.text)).toBe('user deleted');

    //make sure cookies are deleted through logout
    const res = await request(mock).post('/logout');
    expect(res.statusCode).toBe(200);

});

test('method test', async () => {
    const ga = await (request(mock).get('/method'))
        .set('Cookie', [`${TOKEN_COOKIE_NAME}=${token}`]);
    expect(ga.statusCode).toBe(200);
    expect(ga.body.length).toBe(3);

    const mtd_id = ga.body[0].id;

    const g = await (request(mock).get(`/method/${mtd_id}`))
        .set('Cookie', [`${TOKEN_COOKIE_NAME}=${token}`]);
    expect(g.statusCode).toBe(200);
    expect(g.body.name).toBe(ga.body[0].name);
});
