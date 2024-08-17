import mongoose from 'mongoose';

// @mongo: is service name in compose.yaml
const MONGODB_URI = 'mongodb://test:test@mongo:27017/skeleton_test';

// Connect to the in-memory MongoDB server
beforeAll(async () => {
  await mongoose.connect(MONGODB_URI);
}, 30000);

// Clean up the database before each test
beforeEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

// Close the connection after all tests
afterAll(async () => {
  await mongoose.disconnect();
});
