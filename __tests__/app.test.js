const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");
const app = require("../app.js");
const fs = require('fs/promises')

afterAll(() => {
    return db.end();
});
  
beforeEach(() => {
return seed(testData);
});

describe("/api/users", () => {
    test("GET 200: Sends an array of user objects to the client", () => {
        return request(app)
        .get("/api/users")
        .expect(200)
        .then((response) => {
            expect(response.body.users).toEqual([
                {username: 'Legend123'}, 
                {username: 'Legend4272'},
                {username: 'happyamy2016'}
            ])
        })

    })
})

describe("/api/register", () => {
    test("POST 201: user created with a unique username", () => {
        const newUser = {
            username: 'alishow1111',
            password: 'spiderman123'
        }
        return request(app)
        .post("/api/register")
        .send(newUser)
        .expect(201)
        .then((response) => {
            expect(response.body.msg).toBe('User Created')
        })

    })

    test("POST 400: Username already exists ", () => {
        const newUser = {
            username: 'Legend123',
            password: 'spiderman123'
        }
        return request(app)
        .post("/api/register")
        .send(newUser)
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Username already exists')
        })

    })

    test("POST 400: No username given ", () => {
        const newUser = {
            password: 'spiderman123'
        }
        return request(app)
        .post("/api/register")
        .send(newUser)
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Invalid body in request')
        })

    })

    test("POST 400: Password not given ", () => {
        const newUser = {
            username: 'test123',
        }
        return request(app)
        .post("/api/register")
        .send(newUser)
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Invalid body in request')
        })

    })
})

describe("/api/login", () => {
    test("POST 200: Username and password which exist in db", () => {
        const user = {
            username: 'Legend123',
            password: 'password1'
        }
        return request(app)
        .post("/api/login")
        .send(user)
        .expect(200)
        .then((response) => {
            expect(response.body.msg).toBe('Login successful')
        })

    })
    test("POST 401: Username exists but invalid password", () => {
        const user = {
            username: 'Legend123',
            password: 'password5'
        }
        return request(app)
        .post("/api/login")
        .send(user)
        .expect(401)
        .then((response) => {
            expect(response.body.msg).toBe('Invalid password')
        })

    })
    test("POST 401: Username doesn't exist", () => {
        const user = {
            username: 'Legend58',
            password: 'password5'
        }
        return request(app)
        .post("/api/login")
        .send(user)
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('User doesnt exist')
        })

    })
})

