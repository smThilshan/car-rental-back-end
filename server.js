import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './configs/db.js';
import userRouter from './routes/userRoutes.js';
import ownerRouter from './routes/ownerRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';

dotenv.config();

// initialize app
const app = express();

// DB connect
await connectDB();

// Enable CORS (allow requests from any origin - good for dev)
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Test GET route
app.get('/', (req, res) => {
  res.send('✅ API is working!');
});

// Adding routes
app.use("/api/user", userRouter);
app.use("/api/owner", ownerRouter);
app.use("/api/bookings", bookingRouter);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
