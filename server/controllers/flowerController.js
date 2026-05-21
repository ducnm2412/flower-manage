import { db } from "../config/firebase.js";

const normalizeSearchText = (value) => String(value || "").trim().toLowerCase();

const getOwnerIngames = (owners = []) =>
  owners
    .map((owner) => owner?.ingame?.trim())
    .filter(Boolean);

// =====================================
// GET ALL FLOWERS
// =====================================
export const getAllFlowers = async (req, res) => {
  try {
    const snapshot = await db.collection("flowers").get();

    const flowers = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      const ownerIngames = getOwnerIngames(data.owners || []);

      if (!Array.isArray(data.ownerIngames)) {
        doc.ref.update({ ownerIngames }).catch(() => {});
      }

      flowers.push({
        id: doc.id,
        ...data,
        ownerIngames,
      });
    });

    res.json(flowers);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// =====================================
// SEARCH FLOWER BY NAME (CASE-INSENSITIVE)
// =====================================
export const searchByName = async (req, res) => {
  try {
    const { name } = req.params;

    if (!name?.trim()) {
      return res.status(400).json({
        error: "Tên hoa không được để trống",
      });
    }

    // Get all flowers and filter by name (case-insensitive)
    const snapshot = await db.collection("flowers").get();

    const searchNameLower = normalizeSearchText(name);
    const flowers = [];

    snapshot.forEach((doc) => {
      const flowerName = doc.data().name || "";
      if (normalizeSearchText(flowerName).includes(searchNameLower)) {
        flowers.push({
          id: doc.id,
          ...doc.data(),
        });
      }
    });

    res.json(flowers);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// =====================================
// SEARCH FLOWER BY COLOR (CASE-INSENSITIVE)
// =====================================
export const searchByColor = async (req, res) => {
  try {
    const { color } = req.params;

    if (!color?.trim()) {
      return res.status(400).json({
        error: "Mau nen khong duoc de trong",
      });
    }

    const searchColorLower = normalizeSearchText(color);
    const snapshot = await db
      .collection("flowers")
      .where("backgroundColor", "==", searchColorLower)
      .get();

    const flowers = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      flowers.push({
        id: doc.id,
        ...data,
      });
    });

    res.json(flowers);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// =====================================
// GET FLOWERS BY USER (by ingame)
// =====================================
export const getFlowersByUser = async (req, res) => {
  try {
    const { ingame } = req.params;

    if (!ingame?.trim()) {
      return res.status(400).json({
        error: "ingame không được để trống",
      });
    }

    let snapshot = await db
      .collection("flowers")
      .where("ownerIngames", "array-contains", ingame)
      .get();

    const flowers = [];

    if (!snapshot.empty) {
      snapshot.forEach((doc) => {
        flowers.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      return res.json(flowers);
    }

    snapshot = await db.collection("flowers").get();

    snapshot.forEach((doc) => {
      const data = doc.data();
      const owners = data.owners || [];
      const ownerIngames = getOwnerIngames(owners);

      if (!Array.isArray(data.ownerIngames)) {
        doc.ref.update({ ownerIngames }).catch(() => {});
      }

      const hasOwner = owners.some((owner) => owner.ingame === ingame);

      if (hasOwner) {
        flowers.push({
          id: doc.id,
          ...data,
          ownerIngames,
        });
      }
    });

    res.json(flowers);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// =====================================
// GET FLOWERS BY USERNAME (CASE-INSENSITIVE)
// =====================================
export const getFlowersByUsername = async (req, res) => {
  try {
    const { username } = req.params;

    if (!username?.trim()) {
      return res.status(400).json({
        error: "Tên user không được để trống",
      });
    }

    const snapshot = await db.collection("flowers").get();

    const searchUsernameLower = username.toLowerCase();
    const flowers = [];

    snapshot.forEach((doc) => {
      const data = doc.data();

      const owners = data.owners || [];

      // Check if any owner's name matches (case-insensitive)
      const hasOwnerMatch = owners.some((owner) =>
        (owner.name || "").toLowerCase().includes(searchUsernameLower),
      );

      if (hasOwnerMatch) {
        flowers.push({
          id: doc.id,
          ...data,
        });
      }
    });

    res.json(flowers);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// =====================================
// ADD FLOWER
// =====================================
export const addFlower = async (req, res) => {
  try {
    const { name, backgroundColor, description, imageUrl, event, owners } =
      req.body;

    // VALIDATE
    if (
      !name?.trim() ||
      !owners ||
      !Array.isArray(owners)
    ) {
      return res.status(400).json({
        error: "name và owners là bắt buộc",
      });
    }

    const newFlower = {
      name: name.trim(),

      backgroundColor: normalizeSearchText(backgroundColor || "red"),

      description: description || "",

      imageUrl: imageUrl || "",

      event: event || "",

      owners,

      ownerIngames: getOwnerIngames(owners),

      createdAt: new Date(),
    };

    const docRef = await db.collection("flowers").add(newFlower);

    res.status(201).json({
      id: docRef.id,
      ...newFlower,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// =====================================
// UPDATE FLOWER
// =====================================
export const updateFlower = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, backgroundColor, description, imageUrl, event, owners } =
      req.body;

    if (!id?.trim()) {
      return res.status(400).json({
        error: "ID hoa không hợp lệ",
      });
    }

    const flowerRef = db.collection("flowers").doc(id);

    const flowerDoc = await flowerRef.get();

    if (!flowerDoc.exists) {
      return res.status(404).json({
        error: "Không tìm thấy hoa",
      });
    }

    const updateData = {};

    if (name !== undefined) {
      updateData.name = name.trim();
    }

    if (backgroundColor !== undefined) {
      updateData.backgroundColor = normalizeSearchText(backgroundColor);
    }

    if (description !== undefined) {
      updateData.description = description;
    }

    if (imageUrl !== undefined) {
      updateData.imageUrl = imageUrl;
    }

    if (event !== undefined) {
      updateData.event = event;
    }

    if (owners !== undefined) {
      updateData.owners = owners;
      updateData.ownerIngames = getOwnerIngames(owners);
    }

    updateData.updatedAt = new Date();

    await flowerRef.update(updateData);

    const updatedDoc = await flowerRef.get();

    res.json({
      id: updatedDoc.id,
      ...updatedDoc.data(),
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// =====================================
// DELETE FLOWER
// =====================================
export const deleteFlower = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id?.trim()) {
      return res.status(400).json({
        error: "ID không hợp lệ",
      });
    }

    const flowerRef = db.collection("flowers").doc(id);

    const flowerDoc = await flowerRef.get();

    if (!flowerDoc.exists) {
      return res.status(404).json({
        error: "Không tìm thấy hoa",
      });
    }

    await flowerRef.delete();

    res.json({
      message: "Xóa hoa thành công",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// =====================================
// ADD OWNER
// =====================================
export const addOwner = async (req, res) => {
  try {
    const { id } = req.params;

    const { ingame, name } = req.body;

    if (!ingame?.trim() || !name?.trim()) {
      return res.status(400).json({
        error: "ingame và name là bắt buộc",
      });
    }

    const flowerRef = db.collection("flowers").doc(id);

    const flowerDoc = await flowerRef.get();

    if (!flowerDoc.exists) {
      return res.status(404).json({
        error: "Không tìm thấy hoa",
      });
    }

    const flowerData = flowerDoc.data();

    const owners = flowerData.owners || [];

    const existed = owners.some((owner) => owner.ingame === ingame);

    if (existed) {
      return res.status(400).json({
        error: "Owner đã tồn tại",
      });
    }

    owners.push({
      ingame,
      name,
    });

    await flowerRef.update({
      owners,
      ownerIngames: getOwnerIngames(owners),

      updatedAt: new Date(),
    });

    res.json({
      message: "Thêm owner thành công",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// =====================================
// REMOVE OWNER
// =====================================
export const removeOwner = async (req, res) => {
  try {
    const { id } = req.params;

    const { ingame } = req.body;

    if (!ingame?.trim()) {
      return res.status(400).json({
        error: "ingame là bắt buộc",
      });
    }

    const flowerRef = db.collection("flowers").doc(id);

    const flowerDoc = await flowerRef.get();

    if (!flowerDoc.exists) {
      return res.status(404).json({
        error: "Không tìm thấy hoa",
      });
    }

    const flowerData = flowerDoc.data();

    const owners = flowerData.owners || [];



    const updatedOwners = owners.filter((owner) => owner.ingame !== ingame);

    await flowerRef.update({
      owners: updatedOwners,
      ownerIngames: getOwnerIngames(updatedOwners),

      updatedAt: new Date(),
    });

    res.json({
      message: "Xóa owner thành công",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
