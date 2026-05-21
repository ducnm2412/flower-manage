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
  const [adminSearchTerm, setAdminSearchTerm] = useState("");

  // ============================
  // USER INFO
  // ============================
  const userIngame = localStorage.getItem("userIngame");
  const userName = localStorage.getItem("userName");
  const userRole = localStorage.getItem("userRole");
  const isAdmin = userRole === "admin";

  const [showSelectModal, setShowSelectModal] = useState(false);
  const [allFlowers, setAllFlowers] = useState([]);
  const [addingFlowerIds, setAddingFlowerIds] = useState([]);

  const colorLabels = {
    red: "do đỏ red",
    purple: "tim tím purple",
    orange: "cam orange",
    blue: "lam xanh lam blue",
    green: "luc lục xanh lục xanh luc green",
  };

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
    if (addingFlowerIds.includes(flowerId)) return;

    setAddingFlowerIds((prev) => [...prev, flowerId]);

    try {
      await api.post(`/flowers/${flowerId}/owner`, {
        ingame: userIngame,
        name: userName,
      });

      const owner = {
        ingame: userIngame,
        name: userName,
      };
      const selectedFlower = allFlowers.find((flower) => flower.id === flowerId);

      setAllFlowers((prev) =>
        prev.map((flower) =>
          flower.id === flowerId
            ? {
                ...flower,
                owners: [...(flower.owners || []), owner],
              }
            : flower,
        ),
      );

      if (selectedFlower) {
        setFlowers((prev) =>
          prev.some((flower) => flower.id === flowerId)
            ? prev
            : [
                ...prev,
                {
                  ...selectedFlower,
                  owners: [...(selectedFlower.owners || []), owner],
                },
              ],
        );
      }

      setMessage("Thêm hoa thành công!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setError("Lỗi khi thêm: " + (err.response?.data?.error || err.message));
    } finally {
      setAddingFlowerIds((prev) => prev.filter((id) => id !== flowerId));
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

  const normalizedAdminSearchTerm = adminSearchTerm.trim().toLowerCase();

  const displayedFlowers =
    isAdmin && normalizedAdminSearchTerm
      ? flowers.filter((flower) => {
          const ownerText = (flower.owners || [])
            .map((owner) => `${owner.ingame || ""} ${owner.name || ""}`)
            .join(" ");
          const searchableText = [
            flower.name,
            flower.event,
            flower.description,
            flower.backgroundColor,
            colorLabels[flower.backgroundColor],
            ownerText,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          return searchableText.includes(normalizedAdminSearchTerm);
        })
      : flowers;

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

      {isAdmin && (
        <div className="admin-flower-search">
          <input
            type="text"
            value={adminSearchTerm}
            onChange={(e) => setAdminSearchTerm(e.target.value)}
            placeholder="Tìm kiếm hoa theo tên, màu nền, sự kiện hoặc chủ sở hữu..."
          />
          {adminSearchTerm && (
            <button
              type="button"
              className="admin-flower-search-clear"
              onClick={() => setAdminSearchTerm("")}
            >
              Xóa
            </button>
          )}
        </div>
      )}

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
                  const isAdding = addingFlowerIds.includes(flower.id);
                  return (
                    <div 
                      key={flower.id} 
                      style={{ 
                        border: isOwned ? '2px solid #10ac84' : '2px solid transparent', 
                        borderRadius: '16px', 
                        cursor: isOwned || isAdding ? 'not-allowed' : 'pointer', 
                        opacity: isOwned || isAdding ? 0.6 : 1,
                        position: 'relative',
                        transition: 'transform 0.2s',
                        transform: !isOwned && !isAdding ? 'scale(1)' : 'none'
                      }}
                      onMouseEnter={(e) => { if (!isOwned && !isAdding) e.currentTarget.style.transform = 'scale(1.05)' }}
                      onMouseLeave={(e) => { if (!isOwned && !isAdding) e.currentTarget.style.transform = 'scale(1)' }}
                      onClick={() => !isOwned && !isAdding && handleSelectFlowerToAdd(flower.id)}
                    >
                      <FlowerCard flower={flower} showActions={false} />
                      {(isOwned || isAdding) && (
                        <div style={{
                          position: 'absolute', top: '10px', right: '10px', 
                          background: '#10ac84', color: 'white', padding: '4px 10px', 
                          borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', zIndex: 10
                        }}>
                          {isAdding ? "Đang thêm..." : "Đã sở hữu"}
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

        ) : displayedFlowers.length === 0 ? (

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
              displayedFlowers.map((flower) => (

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
