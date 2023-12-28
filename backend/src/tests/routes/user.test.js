const request = require("supertest");
const path = require("path");
const mongoose = require("mongoose");
const app = require("../../app");
const User = require("../../models/user");

require("dotenv").config({ path: path.join(__dirname, "../../../.env.jest") });

beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URL);
});

afterAll(async () => {
    await mongoose.connection.close();
});

afterEach(async () => {
    await User.deleteMany();
});

describe("POST /register", function() {
    test("should create a new customer", async () => {
        const response = await request(app)
            .post("/users/register")
            .send({
                email: "test-new@test.com",
                name: "test-new",
                password: "test1234",
            })
            .expect(201);
        
        expect(Object.keys(response.body.data.user).sort()).toEqual(["_id", "name", "email", "createdAt", "updatedAt"].sort());
    });

    test("should return error if a customer already exists", async () => {
        await User.create({
            name: "test-new",
            email: "test-new@test.com",
            password: "test1234",
        });

        await request(app)
            .post("/users/register")
            .send({
                email: "test-new@test.com",
                name: "test-new",
                password: "test1234",
            })
            .expect(400);
    });

    test("should return error if passowd is invalid", async () => {
        const response = await request(app)
            .post("/users/register")
            .send({
                email: "test-new@test.com",
                name: "test-new",
                password: "test",
            })
            .expect(422);
        expect(Object.keys(response.body.error).length).toEqual(1);
        expect(response.body.error).toHaveProperty("password");
        expect(response.body.error.password).toEqual("Must be at least 8 chars long")
    });

    test("should return error if email is invalid", async () => {
        const response = await request(app)
            .post("/users/register")
            .send({
                email: "test-new_test.com",
                name: "test-new",
                password: "test1234",
            })
            .expect(422);
        expect(Object.keys(response.body.error).length).toEqual(1);
        expect(response.body.error).toHaveProperty("email");
        expect(response.body.error.email).toEqual("Enter a valid email address")
    });

    test("should return error if name is invalid", async () => {
        const response = await request(app)
            .post("/users/register")
            .send({
                email: "test-new@test.com",
                name: "    ",
                password: "test1234",
            })
            .expect(422);
        expect(Object.keys(response.body.error).length).toEqual(1);
        expect(response.body.error).toHaveProperty("name");
        expect(response.body.error.name).toEqual("You name is required")
    });

    test("should return error if name is empty", async () => {
        const response = await request(app)
            .post("/users/register")
            .send({
                email: "test-new@test.com",
                password: "test1234",
            })
            .expect(422);
        expect(Object.keys(response.body.error).length).toEqual(1);
        expect(response.body.error).toHaveProperty("name");
        expect(response.body.error.name).toEqual("You name is required")
    });
});

describe("GET /me", function() {
    test("should return error if a customer is not auth", async () => {
        await User.create({
            name: "test-user",
            email: "test-user@test.com",
            password: "test1234",
        });

        await request(app)
            .get("/users/me")
            .send()
            .expect(401);
    });

    test("should return customer profile", async () => {
        const user = await User.create({
            name: "test-user",
            email: "test-user@test.com",
            password: "test1234",
        });

        const refreshToken = await user.generateRefreshToken();
        const accessToken = user.generateAccessToken();

        const response = await request(app)
            .get("/users/me")
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', [`refreshToken=${refreshToken}`])
            .send()
            .expect(200);

        expect(Object.keys(response.body.data.user).sort()).toEqual(["_id", "name", "email", "createdAt", "updatedAt"].sort());
    });
});