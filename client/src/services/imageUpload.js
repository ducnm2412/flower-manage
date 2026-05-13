import axios from "axios";

const IMGBB_API_KEY = "c0e5bd7c8ce0b1d484860764ea85574b";

export const uploadImageToImgBB = async (imageFile) => {
  try {
    const formData = new FormData();

    formData.append("image", imageFile);

    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
      formData
    );

    return response.data.data.url;

  } catch (error) {
    console.error("Upload Error:", error);

    throw error;
  }
};