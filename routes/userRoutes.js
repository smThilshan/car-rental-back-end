import express from 'express';
import { getCars, getUserData, loginUser, registerUser } from '../controllers/userController.js';
import { protect } from '../middlewares/auth.js';
import { getUserBookings } from '../controllers/bookingController.js';

const userRouter = express.Router();

userRouter.post("/register",registerUser)
userRouter.post("/login", loginUser);
userRouter.get("/data", protect, getUserData);
userRouter.get("/cars", protect, getCars);
userRouter.get("/bookings", protect ,getUserBookings);

export default userRouter;