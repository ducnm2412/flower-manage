import express from "express";

import {
  getAllFlowers,
  searchByName,
  searchByColor,
  getFlowersByUser,
  getFlowersByUsername,
  addFlower,
  updateFlower,
  deleteFlower,
  addOwner,
  removeOwner,
} from "../controllers/flowerController.js";

const router = express.Router();

// ===============================
// GET ALL FLOWERS
// ===============================
router.get("/", getAllFlowers);

// ===============================
// SEARCH BY NAME
// ===============================
router.get("/search/name/:name", searchByName);

// ===============================
// SEARCH BY COLOR
// ===============================
router.get("/search/color/:color", searchByColor);

// ===============================
// GET FLOWERS BY USER INGAME
// ===============================
router.get("/user/:ingame", getFlowersByUser);

// ===============================
// GET FLOWERS BY USERNAME (CASE-INSENSITIVE)
// ===============================
router.get("/username/:username", getFlowersByUsername);

// ===============================
// ADD FLOWER
// ===============================
router.post("/", addFlower);

// ===============================
// UPDATE FLOWER
// ===============================
router.put("/:id", updateFlower);

// ===============================
// ADD OWNER
// ===============================
router.post("/:id/owner", addOwner);

// ===============================
// REMOVE OWNER
// ===============================
router.delete("/:id/owner", removeOwner);

// ===============================
// DELETE FLOWER
// ===============================
router.delete("/:id", deleteFlower);

export default router;
