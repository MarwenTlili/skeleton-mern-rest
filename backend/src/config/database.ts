import mongoose from 'mongoose';
import { MONGODB_URI } from './env';
import { MAX_CONNECT_RETRIES, CONNECT_RETRY_DELAY } from './constants';

const connectToMongoDB = async () => {
  let retries = 0;
  const withRetry = async () => {
    try {
      console.info(`Connecting to "${MONGODB_URI}" ...`)
      await mongoose.connect(MONGODB_URI);
      console.info('Connected to MongoDB successfully.')
    } catch (e) {
      console.error("Error connecting to MongoDB:", e);
      retries++;
      if (retries <= MAX_CONNECT_RETRIES) {
        console.info(`Retrying connection in ${CONNECT_RETRY_DELAY / 1000} seconds...`);
        setTimeout(withRetry, CONNECT_RETRY_DELAY);
      } else {
        console.error(`Max retries (${MAX_CONNECT_RETRIES}) exceeded. Could not connect to MongoDB.`);
      }
    }
  };

  await withRetry();
}

export default connectToMongoDB;
