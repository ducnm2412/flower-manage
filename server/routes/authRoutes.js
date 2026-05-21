import express from "express";
import {
  login,
  getAllUsers,
  getUserOptions,
  addUser,
  updateUser,
  deleteUser,
} from "../controllers/authController.js";
import { changePassword } from "../controllers/authController.js";
const router = express.Router();
router.put("/change-password", changePassword);
// Login cho user và admin
router.post("/login", login);

// Lấy tất cả user (chỉ admin)
router.get("/users", getAllUsers);
router.get("/user-options", getUserOptions);

// Thêm user (chỉ admin)
router.post("/users", addUser);

// Sửa user theo id (chỉ admin)
router.put("/users/:id", updateUser);

// Xóa user theo id (chỉ admin)
router.delete("/users/:id", deleteUser);

export default router;
