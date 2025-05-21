import express from "express";
import { registerUser, loginUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);  // Register a new user
router.post("/login", loginUser);        // Login a user

export default router;
