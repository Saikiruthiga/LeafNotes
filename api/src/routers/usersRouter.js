import express from "express";
import { authenticate } from "../middlewares/authenticate.js";

import { getUserProfile } from "../controllers/usersController.js";

const usersRouter = express.Router();

usersRouter.get("/profile/:user_id", authenticate, getUserProfile);

export default usersRouter;