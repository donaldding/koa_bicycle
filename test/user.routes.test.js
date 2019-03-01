const server = require("./server");
const request = require("supertest");
const db = require("../db/schema");
const truncate = require("./truncate");
const User = db["User"];

// close the server after each test
afterEach(() => {
  server.close();
});

describe("POST /api/users", () => {
  beforeEach(async () => {
    // db.sequelize.sync({ force: true });
    // await spawn("./node_modules/.bin/sequelize", ["db:migrate"], spawnOptions);
    await truncate();
    console.log("clean db");
  });
  test("should respond as expected", async () => {
    const users = await User.findAll();
    expect(users.length).toBe(0);
    const response = await request(server)
      .post("/api/users")
      .send({
        cellphone: "12345678",
        password: "123456",
        name: "test",
        gender: 'f'
      });
    expect(response.status).toEqual(200);
    expect(response.type).toEqual("application/json");
    User.findAll().then(datas => {
      expect(datas.length).toBe(1);
    });
  });
});

describe("GET /api/users/info", () => {
  test("should respond as expected", async () => {
    const createUser = await request(server)
      .post("/api/users/login")
      .send({
        cellphone: "12345678",
        password: "123456",
      })

    const response = await request(server)
      .get("/api/users/info")
      .set('Authorization', createUser.body.data.token)
    expect(response.status).toEqual(200);
    expect(response.type).toEqual("application/json")
    expect(response.body.data.username).toEqual(createUser.body.data.username)
  })
})