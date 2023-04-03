// THESE ARE NODE APIs WE WISH TO USE
const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const request = require('supertest')
const enableDestroy = require('server-destroy')

// CREATE OUR SERVER
dotenv.config()
const PORT = process.env.PORT || 4000;
const app = express()

// SETUP THE MIDDLEWARE
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: ["http://localhost:3000", "https://finaltest1-front.onrender.com", "https://finaltest1.onrender.com"],
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

// SETUP OUR OWN ROUTERS AS MIDDLEWARE
const authRouter = require('../../routes/auth-router')
app.use('/auth', authRouter)
const playlistsRouter = require('../../routes/playlists-router')
app.use('/api', playlistsRouter)

// INITIALIZE OUR DATABASE OBJECT
const db = require('../../db')
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

// PUT THE SERVER IN LISTENING MODE
//app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

let server;

describe('Jest-Tests', () => {
    beforeAll(async() => {
        server = await app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
        global.agent = request.agent(server);
    });
    afterAll(async() => {
        await server.close();
        db.close();
    });

    describe('API route sanity check', () => {
        test('Should respond 404 for random request to /api', async () => {
            const response = await request(server)
                .get('/api/garbage')
                .expect('Content-Type', "text/html; charset=utf-8")
                .expect(404)
            expect(response.body.success).toBe(undefined);
        });
    });
    
    describe('auth route sanity check', () => {
        test('Should respond 404 for random request to /auth', async () => {
            const response = await request(server)
                .get('/auth/garbage')
                .expect('Content-Type', "text/html; charset=utf-8")
                .expect(404)
            expect(response.body.success).toBe(undefined);
        });
    });
});