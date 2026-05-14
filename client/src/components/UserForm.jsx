import { useState, useEffect } from "react";
import api from "../services/api";
import "./UserForm.css";

export default function UserForm({ user, onClose, onSubmit, userRole }) {
  const [formData, setFormData] = useState({
    name: "",
    ingame: "",
    year: new Date().getFullYear(),
    role: "user",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        ingame: user.ingame || "",
        year: user.year || new Date().getFullYear(),
        role: user.role || "user",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "year" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validate
      if (!formData.name.trim() || !formData.ingame.trim()) {
        setError("Tên và ingame không được để trống");
        setLoading(false);
        return;
      }

      if (user) {
        // Update user
        await api.put(`/auth/users/${user.id}`, formData, {
          headers: {
            "x-user-role": userRole,
          },
        });
      } else {
        // Create new user
        await api.post("/auth/users", formData, {
          headers: {
            "x-user-role": userRole,
          },
        });
      }

      onSubmit();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Lỗi khi lưu thông tin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-form-overlay">
      <div className="user-form-container">
        <div className="form-header">
          <h3>{user ? "Sửa người dùng" : "Thêm người dùng mới"}</h3>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Tên người dùng *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nhập tên người dùng"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="ingame">Ingame *</label>
            <input
              type="text"
              id="ingame"
              name="ingame"
              value={formData.ingame}
              onChange={handleChange}
              placeholder="Nhập ingame"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="year">Năm tham gia</label>
              <input
                type="number"
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                min="2000"
                max={new Date().getFullYear()}
              />
            </div>

            {user && (
              <div className="form-group">
                <label htmlFor="role">Vai trò</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            )}
          </div>

          {!user && (
            <div className="form-info">
              <p>📄 Vai trò mới user sẽ tự động là "User"</p>
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={loading}
            >
              Hủy
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Đang lưu..." : user ? "Cập nhật" : "Tạo mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
