import express, { Application } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import { API_VERSION } from './config/constants';
import userRoutes from './routes/user.routes';
import errorMiddleware from './middlewares/error.middleware';
import notFoundMiddleware from './middlewares/notFound.middleware';

const app: Application = express();

/**
 * middleware to enable CORS cross origins
 */
const allowedOrigins = ['http://localhost:3000'];
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false, // JWT in Authorization Header (recommended)
  // credentials: true, // Enable credentials to include cookies in requests
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// secure Express apps by setting HTTP response headers.
app.use(helmet());

// logger middleware, options (combined, common, dev, short, tiny)
app.use(morgan('dev'));

app.use(express.json());

app.use(`/api/${API_VERSION}/users`, userRoutes);

// 404 Error Handler
app.use(notFoundMiddleware);

// 500 Error Handler
app.use(errorMiddleware);

export default app;
