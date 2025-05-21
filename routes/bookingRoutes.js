// bookingRoutes.js

import express from 'express';
import { protect } from "../middleware/authMiddleware.js"; // Correct import
import { createBooking, getUserBookings } from '../controllers/bookingController.js';

const router = express.Router();

router.post("/", protect, createBooking); // Apply protect middleware
router.get("/user", protect, getUserBookings); // Apply protect middleware

export default router;
