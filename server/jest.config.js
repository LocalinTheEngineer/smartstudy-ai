module.exports = {
  testEnvironment: "node",
  setupFiles: ["<rootDir>/tests/testUtils/setupEnv.js"],
  // mongodb-memory-server ilk calistiginda kucuk bir mongod binary'si
  // indirebiliyor, o yuzden normal 5sn'lik varsayilan yerine biraz pay birakiyoruz.
  testTimeout: 30000,
};
