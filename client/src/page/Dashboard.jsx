import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import MyFlowers from "./MyFlowers";
import SearchFlowers from "./SearchFlowers";
import "./Dashboard.css";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("my-flowers");
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      navigate("/");
      return;
    }

    const userName = localStorage.getItem("userName");
    const userRole = localStorage.getItem("userRole");

    setUser({
      id: userId,
      name: userName,
      role: userRole,
    });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userYear");

    navigate("/");
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    setPasswordError("");
    setPasswordSuccess("");

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Mật khẩu mới không khớp");
      return;
    }

    try {
      setChangingPassword(true);

      await api.put("/auth/change-password", {
        userId: user.id,
        oldPassword,
        newPassword,
      });

      setPasswordSuccess("Đổi mật khẩu thành công");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess("");
      }, 1000);
    } catch (err) {
      setPasswordError(err.response?.data?.error || "Đổi mật khẩu thất bại");
    } finally {
      setChangingPassword(false);
    }
  };

  if (!user) {
    return <div className="loading">Đang tải...</div>;
  }

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-brand">
            <h2>🌸 Flower Manage</h2>
          </div>

          <button
            className={`hamburger-menu ${mobileMenuOpen ? "active" : ""}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div className={`navbar-menu ${mobileMenuOpen ? "mobile-open" : ""}`}>
            <button
              className={`nav-link ${
                activeTab === "my-flowers" ? "active" : ""
              }`}
              onClick={() => {
                setActiveTab("my-flowers");
                setMobileMenuOpen(false);
              }}
            >
              📝 Nhập hoa
            </button>

            <button
              className={`nav-link ${activeTab === "search" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("search");
                setMobileMenuOpen(false);
              }}
            >
              🔍 Tra cứu
            </button>
          </div>

          <div className="navbar-user">
            <div className="user-info">
              <span className="user-name">{user.name}</span>

              {user.role === "admin" && (
                <span className="user-badge">Admin</span>
              )}
            </div>

            <button
              className="btn-change-password"
              onClick={() => setShowPasswordModal(true)}
            >
              Đổi mật khẩu
            </button>

            <button className="btn-logout" onClick={handleLogout}>
              Đăng xuất
            </button>
          </div>
        </div>
      </nav>

      <main className="dashboard-content">
        {activeTab === "my-flowers" && <MyFlowers />}
        {activeTab === "search" && <SearchFlowers />}
      </main>

      {showPasswordModal && (
        <div className="password-modal-overlay">
          <div className="password-modal">
            <div className="password-modal-header">
              <h3>Đổi mật khẩu</h3>

              <button
                className="password-modal-close"
                onClick={() => setShowPasswordModal(false)}
              >
                ✕
              </button>
            </div>

            {passwordError && (
              <div className="alert alert-error">{passwordError}</div>
            )}

            {passwordSuccess && (
              <div className="alert alert-success">{passwordSuccess}</div>
            )}

            <form onSubmit={handleChangePassword}>
              <div className="form-group">
                <label>Mật khẩu cũ</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Nhập mật khẩu cũ"
                />
              </div>

              <div className="form-group">
                <label>Mật khẩu mới</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nhập mật khẩu mới"
                />
              </div>

              <div className="form-group">
                <label>Nhập lại mật khẩu mới</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới"
                />
              </div>

              <div className="password-modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Hủy
                </button>

                <button
                  type="submit"
                  className="btn-submit"
                  disabled={changingPassword}
                >
                  {changingPassword ? "Đang đổi..." : "Lưu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
