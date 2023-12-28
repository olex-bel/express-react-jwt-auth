const path = require("path");
const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../../app");
const User = require("../../models/user");

require("dotenv").config({ path: path.join(__dirname, "../../../.env.jest") });

beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URL);
});

afterAll(async () => {
    await mongoose.connection.close();
});

beforeEach(async () => {
    await User.create({
        name: "test",
        email: "test@test.com",
        password: "test1234",
    });
});

afterEach(async () => {
    await User.deleteMany();
});

describe("POST /auth/login", function() {
    test("should login existin user", async () => {
        const response = await request(app)
            .post("/auth/login")
            .send({
                email: "test@test.com",
                password: "test1234",
            })
            .expect(200);
    
        expect(response.headers['set-cookie']).not.toBeNull();
        expect(response.headers['set-cookie']).not.toBeUndefined();

        const user = await User.findOne({ email: "test@test.com" });
        const refreshToken = user.tokens[0].token;
        const tokenCookie = response.headers['set-cookie'].find(cookie => cookie.startsWith(`refreshToken=${refreshToken}`));

        expect(tokenCookie).toBeDefined();
        expect(tokenCookie).toMatch("HttpOnly");
        expect(tokenCookie).toMatch("Secure");
        expect(tokenCookie).toMatch("SameSite=None");

        expect(response.body.data.user._id).toEqual(user._id.toString());
        expect(response.body.data).toHaveProperty("token");
        expect(Object.keys(response.body.data.user).sort()).toEqual(["_id", "name", "email", "createdAt", "updatedAt"].sort());
    });

    test("should login if an user does not exists", async () => {
        await request(app)
            .post("/auth/login")
            .send({
                email: "test-invalid@test.com",
                password: "test1234",
            })
            .expect(401);
    });
});

describe("POST /auth/refresh", function() {
    test("should return new token", async () => {
        const user = await User.findOne({ email: "test@test.com" });
        const refreshToken = await user.generateRefreshToken();

        const response = await request(app)
            .post("/auth/refresh")
            .set('Cookie', [`refreshToken=${refreshToken}`])
            .expect(200);
        
        expect(response.body.data).toHaveProperty("token");    
    });

    test("should not return new token if refreshToken is not valid", async () => {
        const user = await User.findOne({ email: "test@test.com" });
        const refreshToken = await user.generateRefreshToken();

        user.tokens = [];
        await user.save();

        await request(app)
            .post("/auth/refresh")
            .set('Cookie', [`refreshToken=${refreshToken}`])
            .expect(401);
    });
});

describe("POST /auth/logout", function() {
    test("should logout a user", async () => {
        const user = await User.findOne({ email: "test@test.com" });
        const refreshToken = await user.generateRefreshToken();
        const accessToken = user.generateAccessToken();

        await request(app)
            .post("/auth/logout")
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', [`refreshToken=${refreshToken}`])
            .expect(204);
    });

    test("should return error if refreshToken is not valid", async () => {
        const user = await User.findOne({ email: "test@test.com" });
        const refreshToken = await user.generateRefreshToken();
        const accessToken = user.generateAccessToken();

        user.tokens = [];
        await user.save();

        await request(app)
            .post("/auth/logout")
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', [`refreshToken=${refreshToken}`])
            .expect(401);
    });

    test("should return error if token not send", async () => {
        const user = await User.findOne({ email: "test@test.com" });
        await user.generateRefreshToken();
        user.generateAccessToken();

        await request(app)
            .post("/auth/logout")
            .expect(401);
    });
});