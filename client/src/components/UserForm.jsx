import { useState, useEffect } from "react";
import api from "../services/api";
import "./UserForm.css";

export default function UserForm({ user, onClose, onSubmit, userRole }) {
  const [formData, setFormData] = useState({
    name: "",
    ingame: "",
    password: "",
    year: new Date().getFullYear(),
    role: "user",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        ingame: user.ingame || "",
        password: "",
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

      // Password validate khi tạo mới
      if (!user && !formData.password.trim()) {
        setError("Password không được để trống");

        setLoading(false);

        return;
      }

      const submitData = {
        ...formData,
      };

      // Nếu edit mà password rỗng → không update
      if (user && !submitData.password.trim()) {
        delete submitData.password;
      }

      if (user) {
        // Update user
        await api.put(`/auth/users/${user.id}`, submitData, {
          headers: {
            "x-user-role": userRole,
          },
        });
      } else {
        // Create user
        await api.post("/auth/users", submitData, {
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
          {/* NAME */}
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

          {/* INGAME */}
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

          {/* PASSWORD */}
          <div className="form-group">
            <label htmlFor="password">
              Password {!user ? "*" : "(để trống nếu không đổi)"}
            </label>

            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Nhập password"
              />

              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          <div className="form-row">
            {/* YEAR */}
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

            {/* ROLE */}
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
              <p>📄 Vai trò mặc định sẽ là "User"</p>
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
