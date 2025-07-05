import express from 'express';
import { protect } from '../middlewares/auth.js';
import { changeRoleToOwner } from '../controllers/ownerController.js';

const ownerRouter = express.Router();

ownerRouter.post("/change-role", protect,changeRoleToOwner);

export default ownerRouter;