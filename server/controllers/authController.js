import { db } from "../config/firebase.js";

// Helper: Check if admin exists
const adminExists = async () => {
  const adminSnapshot = await db
    .collection("users")
    .where("role", "==", "admin")
    .get();

  return !adminSnapshot.empty;
};

// ==========================
// LOGIN
// ==========================
export const login = async (req, res) => {
  try {
    const { ingame, password } = req.body;

    // Validate
    if (!ingame || !password) {
      return res.status(400).json({
        error: "ingame và password là bắt buộc",
      });
    }

    // Find user
    const snapshot = await db
      .collection("users")
      .where("ingame", "==", ingame)
      .where("password", "==", password)
      .get();

    // Not found
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

    // Không trả password về frontend
    delete userData.password;

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

// ==========================
// GET ALL USERS
// ==========================
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
      const data = doc.data();

      delete data.password;

      users.push({
        id: doc.id,
        ...data,
      });
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// ==========================
// ADD USER
// ==========================
export const addUser = async (req, res) => {
  try {
    const userRole = req.headers["x-user-role"];

    if (userRole !== "admin") {
      return res.status(403).json({
        error: "Chỉ admin có quyền tạo user",
      });
    }

    const { ingame, name, password, year } = req.body;

    // Validate
    if (!ingame || !name || !password || !year) {
      return res.status(400).json({
        error: "ingame, name, password, year là bắt buộc",
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

    // Create user
    const newUser = {
      ingame: ingame.trim(),
      name: name.trim(),
      password: password.trim(),
      role: "user",
      year,
      createdAt: new Date(),
    };

    const docRef = await db.collection("users").add(newUser);

    // Không trả password
    const responseUser = {
      id: docRef.id,
      ...newUser,
    };

    delete responseUser.password;

    res.status(201).json({
      message: "Thêm user thành công",
      user: responseUser,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// ==========================
// UPDATE USER
// ==========================
export const updateUser = async (req, res) => {
  try {
    const userRole = req.headers["x-user-role"];

    if (userRole !== "admin") {
      return res.status(403).json({
        error: "Chỉ admin có quyền sửa user",
      });
    }

    const { id } = req.params;

    const { ingame, name, password, role, year } = req.body;

    const userDoc = await db.collection("users").doc(id).get();

    if (!userDoc.exists) {
      return res.status(404).json({
        error: "Không tìm thấy user",
      });
    }

    // Check admin
    if (role === "admin") {
      const adminSnapshot = await db
        .collection("users")
        .where("role", "==", "admin")
        .get();

      if (!adminSnapshot.empty) {
        const currentUserIsAdmin = adminSnapshot.docs.some(
          (doc) => doc.id === id,
        );

        if (!currentUserIsAdmin) {
          return res.status(400).json({
            error: "Chỉ có thể có một admin duy nhất",
          });
        }
      }
    }

    const updateData = {};

    if (ingame !== undefined)
      updateData.ingame = ingame.trim();

    if (name !== undefined)
      updateData.name = name.trim();

    if (password !== undefined)
      updateData.password = password.trim();

    if (role !== undefined)
      updateData.role = role;

    if (year !== undefined)
      updateData.year = year;

    updateData.updatedAt = new Date();

    await db.collection("users").doc(id).update(updateData);

    const updatedDoc = await db.collection("users").doc(id).get();

    const userData = {
      id: updatedDoc.id,
      ...updatedDoc.data(),
    };

    delete userData.password;

    res.json({
      message: "Cập nhật user thành công",
      user: userData,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// ==========================
// DELETE USER
// ==========================
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
export const changePassword = async (req, res) => {
  try {
    const { userId, oldPassword, newPassword } = req.body;

    if (!userId || !oldPassword || !newPassword) {
      return res.status(400).json({
        error: "Thiếu userId, oldPassword hoặc newPassword",
      });
    }

    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({
        error: "Không tìm thấy user",
      });
    }

    const userData = userDoc.data();

    if (userData.password !== oldPassword) {
      return res.status(400).json({
        error: "Mật khẩu cũ không đúng",
      });
    }

    await userRef.update({
      password: newPassword,
      updatedAt: new Date(),
    });

    res.json({
      message: "Đổi mật khẩu thành công",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
