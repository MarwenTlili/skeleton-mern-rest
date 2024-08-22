import mongoose from 'mongoose';

// @mongo: is service name in compose.yaml
const MONGODB_URI = 'mongodb://test:test@mongo:27017/skeleton_test';

// Connect to the MongoDB server
beforeAll(async () => {
    try {
        await mongoose.connect(MONGODB_URI)
    } catch (error) {
        console.log('error: ', error)
    }
}, 60000)

// Clean up the database collections after each test
afterEach(async () => {
    const collections = await mongoose.connection.db.collections()
    for (let collection of collections) {
        await collection.deleteMany({})
    }
})

// Close the connection after all tests
afterAll(async () => {
    await mongoose.disconnect()
})
