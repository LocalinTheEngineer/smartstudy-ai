const request = require("supertest");
const app = require("../src/app");
const db = require("./testUtils/dbHandler");

beforeAll(async () => {
  await db.connect();
});

afterEach(async () => {
  await db.clearDatabase();
});

afterAll(async () => {
  await db.closeDatabase();
});

const userData = {
  name: "Test Kullanici",
  email: "test@example.com",
  password: "sifre123",
};

describe("POST /api/auth/register", () => {
  test("gecerli bilgilerle kayit basarili olmali ve token donmeli", async () => {
    const res = await request(app).post("/api/auth/register").send(userData);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user.email).toBe(userData.email);
  });

  test("ayni e-posta ile ikinci kayit reddedilmeli", async () => {
    await request(app).post("/api/auth/register").send(userData);
    const res = await request(app).post("/api/auth/register").send(userData);
    expect(res.status).toBe(400);
  });

  test("eksik alanla kayit reddedilmeli", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: userData.email, password: userData.password });
    expect(res.status).toBe(400);
  });
});

describe("POST /api/auth/login", () => {
  test("dogru bilgilerle giris basarili olmali", async () => {
    await request(app).post("/api/auth/register").send(userData);
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: userData.email, password: userData.password });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  test("yanlis sifreyle giris reddedilmeli", async () => {
    await request(app).post("/api/auth/register").send(userData);
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: userData.email, password: "yanlissifre" });
    expect(res.status).toBe(400);
  });
});

describe("Korumali route'lar", () => {
  test("token olmadan erisim reddedilmeli", async () => {
    const res = await request(app).get("/api/quiz-attempts/stats");
    expect(res.status).toBe(401);
  });

  test("gecerli token ile erisim kabul edilmeli", async () => {
    const registerRes = await request(app).post("/api/auth/register").send(userData);
    const token = registerRes.body.token;

    const res = await request(app)
      .get("/api/quiz-attempts/stats")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
  });
});
