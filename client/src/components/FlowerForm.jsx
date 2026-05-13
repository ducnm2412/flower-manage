import React, {
  useState,
  useEffect,
} from "react";
import "./FlowerForm.css";
import {
  uploadImageToImgBB,
} from "../services/imageUpload";

export default function FlowerForm({
  flower,
  onSubmit,
  onCancel,
}) {

  // =========================
  // STATES
  // =========================
  const [name, setName] =
    useState("");

  const [
    backgroundColor,
    setBackgroundColor,
  ] = useState("red");

  const [image, setImage] =
    useState(null);

  const [
    previewImage,
    setPreviewImage,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  // =========================
  // LOAD FLOWER DATA
  // =========================
  useEffect(() => {

    if (flower) {

      setName(flower.name);

      setBackgroundColor(
        flower.backgroundColor
      );

      setPreviewImage(
        flower.imageUrl || ""
      );
    }

  }, [flower]);

  // =========================
  // HANDLE IMAGE CHANGE
  // =========================
  const handleImageChange = (
    e
  ) => {

    const file =
      e.target.files[0];

    if (!file) return;

    setImage(file);

    setPreviewImage(
      URL.createObjectURL(file)
    );
  };

  // =========================
  // HANDLE SUBMIT
  // =========================
  const handleSubmit =
    async (e) => {

      e.preventDefault();

      setLoading(true);

      try {

        let imageUrl =
          flower?.imageUrl || "";

        // =====================
        // UPLOAD IMAGE TO IMGBB
        // =====================
        if (image) {

          imageUrl =
            await uploadImageToImgBB(
              image
            );
        }

        // =====================
        // SUBMIT DATA
        // =====================
        await onSubmit({

          name,

          backgroundColor,

          imageUrl,
        });

      } catch (error) {

        console.error(error);

        alert(
          "Upload ảnh thất bại"
        );

      } finally {

        setLoading(false);

      }
    };

  return (

    <div className="flower-form-container">

      <form
        className="flower-form"
        onSubmit={handleSubmit}
      >

        {/* TITLE */}
        <h2>
          {
            flower
              ? "✏️ Sửa hoa"
              : "🌸 Thêm hoa"
          }
        </h2>

        {/* FLOWER NAME */}
        <div className="form-group">

          <label>
            Tên hoa
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
            placeholder="Nhập tên hoa"
            required
          />

        </div>

        {/* BACKGROUND COLOR */}
        <div className="form-group">

          <label>
            Màu nền
          </label>

          <select
            value={
              backgroundColor
            }
            onChange={(e) =>
              setBackgroundColor(
                e.target.value
              )
            }
          >

            <option value="red">
              🔴 Màu đỏ
            </option>

            <option value="purple">
              🟣 Màu tím
            </option>

            <option value="orange">
              🟠 Màu cam
            </option>

          </select>

        </div>

        {/* IMAGE UPLOAD */}
        <div className="form-group">

          <label>
            Ảnh hoa
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={
              handleImageChange
            }
          />

        </div>

        {/* IMAGE PREVIEW */}
        {
          previewImage && (

            <div
              className="
                image-preview
              "
            >

              <img
                src={previewImage}
                alt="Preview"
                className="
                  preview-image
                "
              />

            </div>

          )
        }

        {/* BUTTONS */}
        <div className="form-actions">

          <button
            type="submit"
            className="
              btn btn-primary
            "
            disabled={loading}
          >

            {
              loading
                ? "Đang upload..."
                : flower
                ? "Cập nhật"
                : "Thêm hoa"
            }

          </button>

          <button
            type="button"
            className="
              btn btn-secondary
            "
            onClick={onCancel}
          >
            Hủy
          </button>

        </div>

      </form>

    </div>
  );
}