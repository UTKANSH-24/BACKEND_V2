// import cookieParser from 'cookie-parser';
// config();
// import express from 'express';
// import { config } from 'dotenv';
// import cors from 'cors';
// import morgan from 'morgan';
// import errorMiddleware from './middlewares/error.middleware.js';
// import bodyParser from 'body-parser'
// const app = express();

// // Middlewares
// // Built-In
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// // Parse incoming request bodies in a middleware before your handlers
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// // Third-Party

// const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:5501'];
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   res.header('Access-Control-Allow-Credentials', 'true');

//   // Handle preflight requests
//   if (req.method === 'OPTIONS') {
//     res.sendStatus(200);
//   } else {
//     next();
//   }
// });

// // // const cors = require("cors");
// // app.use(
// //   cors({
// //     origin: allowedOrigins,
// //     credentials: true,
// //   })
// // );



// app.use(morgan('dev'));
// app.use(cookieParser());

// // Server Status Check Route
// app.get('/ping', (_req, res) => {
//   res.send('Pong');
// });

// // Import all routes
// import userRoutes from './routes/user.routes.js';
// import eventRoutes from './routes/event.routes.js';
// import paymentRoutes from './routes/payment.routes.js';
// import miscRoutes from './routes/miscellaneous.routes.js';
// import merchandiseRoutes from './routes/merchandise.routes.js';
// import accommodation from './routes/accommodation.routes.js';

// app.use('/api/v1/user', userRoutes);
// app.use('/api/v1/event', eventRoutes);
// app.use('/api/v1/payments', paymentRoutes);
// app.use('/api/v1', miscRoutes);
// app.use('/api/v1/merchandise', merchandiseRoutes);
// app.use('/api/v1/accommodation', accommodation);

// // Default catch all route - 404
// app.all('*', (_req, res) => {
//   res.status(404).send('path does not exist:');
// });

// // Custom error handling middleware
// app.use(errorMiddleware);

// export default app;




import cookieParser from 'cookie-parser';
config();
import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import errorMiddleware from './middlewares/error.middleware.js';
const app = express();
// Middlewares
// Built-In
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Third-Party
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
  })
);
app.use(morgan('dev'));
app.use(cookieParser());
// Server Status Check Route
app.get('/ping', (_req, res) => {
  res.send('Pong');
});


// Import all routes
import userRoutes from './routes/user.routes.js';
import eventRoutes from './routes/event.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import miscRoutes from './routes/miscellaneous.routes.js';
import merchandiseRoutes from './routes/merchandise.routes.js';
import accommodation from './routes/accommodation.routes.js';

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/event', eventRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1', miscRoutes);
app.use('/api/v1/merchandise', merchandiseRoutes);
app.use('/api/v1/accommodation', accommodation);

// Default catch all route - 404
app.all('*', (_req, res) => {
  res.status(404).send('OOPS!!! 404 Page Not Found');
});
// Custom error handling middleware
app.use(errorMiddleware);
export default app;
