import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

import "./Login.css";

export default function Login() {
  const [ingame, setIngame] = useState("");
  const [name, setName] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      // Validate
      if (!ingame.trim() || !name.trim()) {
        setError("Ingame và tên không được để trống");

        setLoading(false);

        return;
      }

      // Call API
      const response = await api.post("/auth/login", {
        ingame: ingame.trim(),
        name: name.trim(),
      });

      // Save localStorage
      localStorage.setItem("userId", response.data.user.id);

      localStorage.setItem("userIngame", response.data.user.ingame);

      localStorage.setItem("userName", response.data.user.name);

      localStorage.setItem("userRole", response.data.user.role);

      localStorage.setItem("userYear", response.data.user.year);

      // Navigate to appropriate dashboard based on role
      if (response.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>🌸 Flower Manage</h1>

        <p className="subtitle">Đăng nhập để quản lý hoa</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="ingame">Ingame *</label>

            <input
              type="text"
              id="ingame"
              value={ingame}
              onChange={(e) => setIngame(e.target.value)}
              placeholder="Nhập ingame"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="name">Tên *</label>

            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên"
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn btn-login" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
}
