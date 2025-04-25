// beforeAll( async () => {
//     //create mock test user
//     const res = await request(mock).post('/register').send(userInfo).set('Accept', 'application/json');
//     expect(res.statusCode).toBe(200);
//     //login with mock user
//     const login = await request(mock).post('/login').send(loginInfo).set('Accept', 'application/json');
//     expect(login.statusCode).toBe(200);

//     //extract cookie from login
//     const cookies = res.headers['set-cookie'];
//     const tokenCookie = cookies.find(c => c.startsWith(`${TOKEN_COOKIE_NAME}=`));
//     token = tokenCookie.split(';')[0].split('=')[1];

//     //ensure authenticated routes can be hit
//     const check = await request(mock).get('/currentuser').set('Cookie', [`${TOKEN_COOKIE_NAME}=${token}`]);
//     expect(check.statusCode).toBe(200);
// });

test('new test', async () => {
    // const ret = await (request(mock).get('/pokemon/name/1')).set('Cookie', [`${TOKEN_COOKIE_NAME}=${token}`]);
    // log(ret.body);
    expect('test').toBe("test");
});