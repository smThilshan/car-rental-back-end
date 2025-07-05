import express from 'express';
import { protect } from '../middlewares/auth.js';
import { addCar, changeRoleToOwner, deleteCar, getOwnerCars, toggleCarAvailability } from '../controllers/ownerController.js';
import upload from '../middlewares/multer.js';

const ownerRouter = express.Router();

ownerRouter.post("/change-role", protect,changeRoleToOwner);
ownerRouter.post("/add-car", upload.single("image"),protect ,addCar);
ownerRouter.get("/cars", protect ,getOwnerCars);
ownerRouter.post("/toggle-car", protect ,toggleCarAvailability);
ownerRouter.post("/delete-car", protect ,deleteCar);

export default ownerRouter;