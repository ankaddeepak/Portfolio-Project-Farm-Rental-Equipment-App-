import express from "express";
import {
  addEquipment,
  getAllEquipment,
  getEquipmentById,
} from "../controllers/equipmentController.js";

const router = express.Router();

router.post("/", addEquipment); // Create
router.get("/", getAllEquipment); // Read All
router.get("/:id", getEquipmentById); // Read Single

export default router;
