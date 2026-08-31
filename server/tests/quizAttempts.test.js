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

async function registerAndGetToken() {
  const res = await request(app).post("/api/auth/register").send({
    name: "Test Kullanici",
    email: "test@example.com",
    password: "sifre123",
  });
  return res.body.token;
}

// N soruluk bir quiz denemesi olusturur, ilk `correctCount` tanesi dogru,
// gerisi yanlis olacak sekilde - saveAttempt endpoint'inin bekledigi
// formatta (questions[] icinde isCorrect alani var).
function makeAttempt(topic, correctCount, total) {
  const questions = Array.from({ length: total }, (_, i) => ({
    question: `Soru ${i + 1}`,
    correctAnswer: "A",
    userAnswer: i < correctCount ? "A" : "B",
    isCorrect: i < correctCount,
  }));
  return { topic, difficulty: "orta", score: correctCount, total, questions };
}

describe("POST /api/quiz-attempts", () => {
  test("gecerli bir quiz denemesi kaydedilebilmeli", async () => {
    const token = await registerAndGetToken();
    const res = await request(app)
      .post("/api/quiz-attempts")
      .set("Authorization", `Bearer ${token}`)
      .send(makeAttempt("Unreal Engine", 2, 5));

    expect(res.status).toBe(201);
    expect(res.body.topic).toBe("Unreal Engine");
  });
});

describe("GET /api/quiz-attempts/stats", () => {
  test("hic quiz cozulmemisse totalAttempts 0 olmali", async () => {
    const token = await registerAndGetToken();
    const res = await request(app)
      .get("/api/quiz-attempts/stats")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.totalAttempts).toBe(0);
    expect(res.body.weakTopics).toEqual([]);
  });

  test("%60 altindaki bir konu zayif konular listesinde cikmali", async () => {
    const token = await registerAndGetToken();
    await request(app)
      .post("/api/quiz-attempts")
      .set("Authorization", `Bearer ${token}`)
      .send(makeAttempt("Unreal Engine", 2, 5)); // %40 dogruluk

    const res = await request(app)
      .get("/api/quiz-attempts/stats")
      .set("Authorization", `Bearer ${token}`);

    expect(res.body.weakTopics).toContain("Unreal Engine");
    expect(res.body.overallAccuracy).toBe(40);
  });

  test("%80 ve uzerindeki bir konu zayif konular listesinde OLMAMALI", async () => {
    const token = await registerAndGetToken();
    await request(app)
      .post("/api/quiz-attempts")
      .set("Authorization", `Bearer ${token}`)
      .send(makeAttempt("Matematik", 5, 5)); // %100 dogruluk

    const res = await request(app)
      .get("/api/quiz-attempts/stats")
      .set("Authorization", `Bearer ${token}`);

    expect(res.body.weakTopics).not.toContain("Matematik");
    expect(res.body.topics[0].accuracy).toBe(100);
  });

  test("bir kullanicinin istatistikleri baska bir kullaniciya karismamali", async () => {
    const tokenA = await registerAndGetToken();
    const resB = await request(app).post("/api/auth/register").send({
      name: "Ikinci Kullanici",
      email: "second@example.com",
      password: "sifre456",
    });
    const tokenB = resB.body.token;

    await request(app)
      .post("/api/quiz-attempts")
      .set("Authorization", `Bearer ${tokenA}`)
      .send(makeAttempt("Fizik", 5, 5));

    const statsB = await request(app)
      .get("/api/quiz-attempts/stats")
      .set("Authorization", `Bearer ${tokenB}`);

    expect(statsB.body.totalAttempts).toBe(0);
  });
});
