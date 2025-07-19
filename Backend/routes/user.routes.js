import express from "express";
import { asktoAssistant, getCurrentUser, updateAssistant } from "../controllers/user.controller.js";
import isAuth from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js";
const userRoute = express.Router();
userRoute.get("/Current",isAuth ,getCurrentUser);
userRoute.post("/update",isAuth,upload.single("assistantImage"),updateAssistant);
userRoute.post("/asktoAssistent",isAuth,asktoAssistant)
export default userRoute;

