import mongoose from "mongoose";
import connectToMongoDB from "../config/database";
import seedUsers from "./user.seed";

const runSeeders = async () => {
  try {
    // Check if MongoDB is already connected
    // why !:
    // seed.ts file and your server are running in different Node.js processes.
    // and Mongoose maintains its connection state per process.
    if (mongoose.connection.readyState === 1) {
      console.info('MongoDB is already connected.');
    } else {
      console.info('MongoDB is not connected. Establishing connection...');
      await connectToMongoDB();
    }

    console.log("Seeding started ...");
    await seedUsers();
    console.log("Seeding complete.");
  } catch (error) {
    console.error("Error seeding data.", error);
  }
}

runSeeders();

export default runSeeders;
