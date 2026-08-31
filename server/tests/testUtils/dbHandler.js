const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

// Testler icin bellekte (diske hic yazmadan) calisan gecici bir MongoDB
// baslatiyoruz. Boylece testler gercek Atlas veritabanina dokunmuyor ve
// CI ortaminda da (GitHub Actions) ekstra bir kurulum gerekmeden calisiyor.
let mongod;

async function connect() {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
}

async function clearDatabase() {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
}

async function closeDatabase() {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  if (mongod) await mongod.stop();
}

module.exports = { connect, clearDatabase, closeDatabase };
