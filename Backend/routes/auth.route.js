import express from "express";
import { signup, login, logout } from "../controllers/auth.controller.js";

const auth = express.Router();


auth.post("/signup", signup);


auth.post("/login", login);


auth.post("/logout", logout);

export default auth;
