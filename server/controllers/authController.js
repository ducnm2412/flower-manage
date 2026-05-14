import { db } from "../config/firebase.js";

// Helper: Check if admin exists
const adminExists = async () => {
  const adminSnapshot = await db
    .collection("users")
    .where("role", "==", "admin")
    .get();
  return !adminSnapshot.empty;
};

// Login user/admin
export const login = async (req, res) => {
  try {
    const { ingame, name } = req.body;

    // Validate
    if (!ingame || !name) {
      return res.status(400).json({
        error: "ingame và name là bắt buộc",
      });
    }

    // Tìm user theo ingame
    const snapshot = await db
      .collection("users")
      .where("ingame", "==", ingame)
      .where("name", "==", name)
      .get();

    // Không tìm thấy
    if (snapshot.empty) {
      return res.status(401).json({
        error: "Thông tin đăng nhập không chính xác",
      });
    }

    let userData = null;

    snapshot.forEach((doc) => {
      userData = {
        id: doc.id,
        ...doc.data(),
      };
    });

    res.json({
      message: "Đăng nhập thành công",
      user: userData,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// Lấy tất cả users
export const getAllUsers = async (req, res) => {
  try {
    const userRole = req.headers["x-user-role"];

    if (userRole !== "admin") {
      return res.status(403).json({
        error: "Chỉ admin có quyền truy cập",
      });
    }

    const snapshot = await db.collection("users").get();

    const users = [];

    snapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// Thêm user
export const addUser = async (req, res) => {
  try {
    const userRole = req.headers["x-user-role"];

    if (userRole !== "admin") {
      return res.status(403).json({
        error: "Chỉ admin có quyền tạo user",
      });
    }

    const { ingame, name, year } = req.body;

    // Validate
    if (!ingame || !name || !year) {
      return res.status(400).json({
        error: "ingame, name, year là bắt buộc",
      });
    }

    // Check duplicate ingame
    const existingUser = await db
      .collection("users")
      .where("ingame", "==", ingame)
      .get();

    if (!existingUser.empty) {
      return res.status(400).json({
        error: "Ingame đã tồn tại",
      });
    }

    // Create user with role 'user' (force role to be 'user')
    const newUser = {
      ingame: ingame.trim(),
      name: name.trim(),
      role: "user",
      year,
      createdAt: new Date(),
    };

    const docRef = await db.collection("users").add(newUser);

    res.status(201).json({
      message: "Thêm user thành công",
      user: {
        id: docRef.id,
        ...newUser,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const userRole = req.headers["x-user-role"];

    if (userRole !== "admin") {
      return res.status(403).json({
        error: "Chỉ admin có quyền sửa user",
      });
    }

    const { id } = req.params;

    const { ingame, name, role, year } = req.body;

    const userDoc = await db.collection("users").doc(id).get();

    if (!userDoc.exists) {
      return res.status(404).json({
        error: "Không tìm thấy user",
      });
    }

    // Check if trying to change someone to admin
    if (role === "admin") {
      // Check if admin already exists
      const adminSnapshot = await db
        .collection("users")
        .where("role", "==", "admin")
        .get();

      // If admin exists and it's not this user, reject
      if (!adminSnapshot.empty) {
        const currentUserIsAdmin = adminSnapshot.docs.some(
          (doc) => doc.id === id,
        );
        if (!currentUserIsAdmin) {
          return res.status(400).json({
            error: "Chỉ có thể có một admin duy nhất. Admin đã tồn tại.",
          });
        }
      }
    }

    const updateData = {};

    if (ingame !== undefined) updateData.ingame = ingame.trim();

    if (name !== undefined) updateData.name = name.trim();

    if (role !== undefined) updateData.role = role;

    if (year !== undefined) updateData.year = year;

    updateData.updatedAt = new Date();

    await db.collection("users").doc(id).update(updateData);

    const updatedDoc = await db.collection("users").doc(id).get();

    res.json({
      message: "Cập nhật user thành công",
      user: {
        id: updatedDoc.id,
        ...updatedDoc.data(),
      },
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const userRole = req.headers["x-user-role"];

    if (userRole !== "admin") {
      return res.status(403).json({
        error: "Chỉ admin có quyền xóa user",
      });
    }

    const { id } = req.params;

    const userDoc = await db.collection("users").doc(id).get();

    if (!userDoc.exists) {
      return res.status(404).json({
        error: "Không tìm thấy user",
      });
    }

    await db.collection("users").doc(id).delete();

    res.json({
      message: "Xóa user thành công",
      id,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
