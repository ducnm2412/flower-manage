import express from "express";
import {
  login,
  getAllUsers,
  addUser,
  updateUser,
  deleteUser,
} from "../controllers/authController.js";

const router = express.Router();

// Login cho user và admin
router.post("/login", login);

// Lấy tất cả user (chỉ admin)
router.get("/users", getAllUsers);

// Thêm user (chỉ admin)
router.post("/users", addUser);

// Sửa user theo id (chỉ admin)
router.put("/users/:id", updateUser);

// Xóa user theo id (chỉ admin)
router.delete("/users/:id", deleteUser);

export default router;
