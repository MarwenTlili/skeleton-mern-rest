import app from './app';
import connectToMongoDB from './config/database';
import { PORT } from './config/env';

// connect to MongoDB with retry
connectToMongoDB();

app.listen(PORT, () => {
  console.info(`Server is running on port ${PORT}.`);
});
