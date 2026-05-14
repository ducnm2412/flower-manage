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
  const userIngame = localStorage.getItem("userIngame");
  const userName = localStorage.getItem("userName");
  const userRole = localStorage.getItem("userRole");
  const isAdmin = userRole === "admin";

  const [showSelectModal, setShowSelectModal] = useState(false);
  const [allFlowers, setAllFlowers] = useState([]);

  // ============================
  // LOAD FLOWERS
  // ============================
  useEffect(() => {
    if (isAdmin) {
      fetchAdminFlowers();
    } else if (userIngame) {
      fetchUserFlowers();
    }
  }, [isAdmin, userIngame]);

  const fetchAdminFlowers = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/flowers");
      setFlowers(response.data);
    } catch (err) {
      setError("Không thể tải danh sách hoa: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

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
        owners: isAdmin ? [] : [
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
  // DELETE FLOWER OR REMOVE OWNER
  // ============================
  const handleDeleteFlower = async (flowerId) => {
    try {
      if (isAdmin) {
        await api.delete(`/flowers/${flowerId}`);
      } else {
        await api.delete(`/flowers/${flowerId}/owner`, {
          data: { ingame: userIngame }
        });
      }

      setFlowers((prev) => prev.filter((flower) => flower.id !== flowerId));
      setMessage("Xóa thành công!");
      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (err) {
      setError("Lỗi khi xóa: " + (err.response?.data?.error || err.message));
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
    setShowSelectModal(false);
  };

  // ============================
  // FETCH ALL FLOWERS FOR USER
  // ============================
  const fetchAllFlowers = async () => {
    try {
      const response = await api.get("/flowers");
      setAllFlowers(response.data);
    } catch (err) {
      setError("Không thể tải danh sách hoa: " + (err.response?.data?.error || err.message));
    }
  };

  const handleSelectFlowerToAdd = async (flowerId) => {
    try {
      await api.post(`/flowers/${flowerId}/owner`, {
        ingame: userIngame,
        name: userName,
      });
      setMessage("Thêm hoa thành công!");
      setShowSelectModal(false);
      fetchUserFlowers();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setError("Lỗi khi thêm: " + (err.response?.data?.error || err.message));
    }
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
          {isAdmin ? "Quản lý toàn bộ hoa" : "Quản lý hoa của tôi"}
        </h1>

        <button
          className="btn btn-primary"
          onClick={() => {
            setEditingFlower(null);
            if (showForm || showSelectModal) {
              setShowForm(false);
              setShowSelectModal(false);
            } else {
              if (isAdmin) {
                setShowForm(true);
              } else {
                fetchAllFlowers();
                setShowSelectModal(true);
              }
            }
          }}
        >
          {
            (showForm || showSelectModal)
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

      {/* SELECT MODAL FOR USER */}
      {showSelectModal && !isAdmin && (
        <div className="modal-overlay">
          <div className="modal-container select-flower-modal">
            <div className="modal-header">
              <h2>🌸 Chọn hoa để thêm</h2>
              <button className="modal-close" onClick={handleCancel}>✕</button>
            </div>
            <div className="modal-body">
              <div className="flowers-grid">
                {allFlowers.map(flower => {
                  const isOwned = flower.owners?.some(o => o.ingame === userIngame);
                  return (
                    <div 
                      key={flower.id} 
                      style={{ 
                        border: isOwned ? '2px solid #10ac84' : '2px solid transparent', 
                        borderRadius: '16px', 
                        cursor: isOwned ? 'not-allowed' : 'pointer', 
                        opacity: isOwned ? 0.6 : 1,
                        position: 'relative',
                        transition: 'transform 0.2s',
                        transform: !isOwned ? 'scale(1)' : 'none'
                      }}
                      onMouseEnter={(e) => { if (!isOwned) e.currentTarget.style.transform = 'scale(1.05)' }}
                      onMouseLeave={(e) => { if (!isOwned) e.currentTarget.style.transform = 'scale(1)' }}
                      onClick={() => !isOwned && handleSelectFlowerToAdd(flower.id)}
                    >
                      <FlowerCard flower={flower} showActions={false} />
                      {isOwned && (
                        <div style={{
                          position: 'absolute', top: '10px', right: '10px', 
                          background: '#10ac84', color: 'white', padding: '4px 10px', 
                          borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', zIndex: 10
                        }}>
                          Đã sở hữu
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
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
              onClick={() => {
                if (isAdmin) setShowForm(true);
                else { fetchAllFlowers(); setShowSelectModal(true); }
              }}
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
                  onEdit={isAdmin ? handleEdit : null}
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