import React, { useState, useEffect } from "react";
import api from "../services/api";
import FlowerCard from "../components/FlowerCard";
import FlowerForm from "../components/FlowerForm";
import "./MyFlowers.css";

export default function MyFlowers() {

  const [flowers, setFlowers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingFlower, setEditingFlower] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ============================
  // USER INFO
  // ============================
  const userIngame =
    localStorage.getItem("userIngame");

  const userName =
    localStorage.getItem("userName");

  // ============================
  // LOAD FLOWERS
  // ============================
  useEffect(() => {

    if (userIngame) {
      fetchUserFlowers();
    }

  }, [userIngame]);

  // ============================
  // FETCH FLOWERS
  // ============================
  const fetchUserFlowers = async () => {

    setLoading(true);
    setError("");

    try {

      const response =
        await api.get(
          `/flowers/user/${userIngame}`
        );

      console.log(
        "Flowers API Response:"
      );

      console.log(response.data);

      setFlowers(response.data);

    } catch (err) {

      setError(
        "Không thể tải hoa của bạn: " +
          (
            err.response?.data?.error ||
            err.message
          ),
      );

    } finally {

      setLoading(false);

    }
  };

  // ============================
  // ADD FLOWER
  // ============================
  const handleAddFlower = async (
    formData
  ) => {

    try {

      const payload = {

        ...formData,

        owners: [
          {
            ingame: userIngame,
            name: userName,
          },
        ],
      };

      console.log(
        "Payload gửi lên:"
      );

      console.log(payload);

      const response =
        await api.post(
          "/flowers",
          payload
        );

      console.log(
        "Flower created:"
      );

      console.log(response.data);

      setFlowers((prev) => [
        ...prev,
        response.data,
      ]);

      setMessage(
        "Thêm hoa thành công!"
      );

      setShowForm(false);

      setTimeout(() => {
        setMessage("");
      }, 3000);

    } catch (err) {

      setError(
        "Lỗi khi thêm hoa: " +
          (
            err.response?.data?.error ||
            err.message
          ),
      );

    }
  };

  // ============================
  // UPDATE FLOWER
  // ============================
  const handleUpdateFlower =
    async (formData) => {

      try {

        const payload = {

          ...formData,

          owners:
            editingFlower.owners,
        };

        const response =
          await api.put(
            `/flowers/${editingFlower.id}`,
            payload
          );

        setFlowers((prev) =>
          prev.map((flower) =>
            flower.id ===
            editingFlower.id
              ? response.data
              : flower
          )
        );

        setMessage(
          "Cập nhật hoa thành công!"
        );

        setEditingFlower(null);

        setShowForm(false);

        setTimeout(() => {
          setMessage("");
        }, 3000);

      } catch (err) {

        setError(
          "Lỗi khi cập nhật hoa: " +
            (
              err.response?.data?.error ||
              err.message
            ),
        );

      }
    };

  // ============================
  // DELETE FLOWER
  // ============================
  const handleDeleteFlower =
    async (flowerId) => {


      try {

        await api.delete(
          `/flowers/${flowerId}`
        );

        setFlowers((prev) =>
          prev.filter(
            (flower) =>
              flower.id !== flowerId
          )
        );

        setMessage(
          "Xóa hoa thành công!"
        );

        setTimeout(() => {
          setMessage("");
        }, 3000);

      } catch (err) {

        setError(
          "Lỗi khi xóa hoa: " +
            (
              err.response?.data?.error ||
              err.message
            ),
        );

      }
    };

  // ============================
  // EDIT FLOWER
  // ============================
  const handleEdit = (flower) => {

    setEditingFlower(flower);

    setShowForm(true);
  };

  // ============================
  // CANCEL FORM
  // ============================
  const handleCancel = () => {

    setEditingFlower(null);

    setShowForm(false);
  };

  // ============================
  // SUBMIT FORM
  // ============================
  const handleSubmit = (
    formData
  ) => {

    if (editingFlower) {

      handleUpdateFlower(
        formData
      );

    } else {

      handleAddFlower(
        formData
      );

    }
  };

  return (

    <div className="my-flowers">

      {/* HEADER */}
      <div className="page-header">

        <h1>
          Quản lý hoa của tôi
        </h1>

        <button
          className="btn btn-primary"
          onClick={() => {

            setEditingFlower(null);

            setShowForm(!showForm);

          }}
        >
          {
            showForm
              ? "✕ Đóng"
              : "+ Thêm hoa mới"
          }
        </button>

      </div>

      {/* ALERT */}
      {
        message && (
          <div className="alert alert-success">
            {message}
          </div>
        )
      }

      {
        error && (
          <div className="alert alert-error">
            {error}
          </div>
        )
      }

      {/* FORM */}
      {showForm && (
  <div className="modal-overlay">

    <div className="modal-container">

      <div className="modal-header">

        <h2>
          {editingFlower
            ? "✏️ Chỉnh sửa hoa"
            : "🌸 Thêm hoa mới"}
        </h2>

        <button
          className="modal-close"
          onClick={handleCancel}
        >
          ✕
        </button>

      </div>

      <div className="modal-body">

        <FlowerForm
          flower={editingFlower}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />

      </div>

    </div>

  </div>
)}

      {/* LOADING */}
      {
        loading ? (

          <div className="loading">
            Đang tải hoa...
          </div>

        ) : flowers.length === 0 ? (

          <div className="empty-state">

            <p>
              Bạn chưa có hoa nào
            </p>

            <button
              className="btn btn-primary"
              onClick={() =>
                setShowForm(true)
              }
            >
              + Thêm hoa đầu tiên
            </button>

          </div>

        ) : (

          <div className="flowers-grid">

            {
              flowers.map((flower) => (

                <FlowerCard
                  key={flower.id}
                  flower={flower}
                  onEdit={handleEdit}
                  onDelete={handleDeleteFlower}
                  showActions={true}
                />

              ))
            }

          </div>

        )
      }

    </div>
  );
}