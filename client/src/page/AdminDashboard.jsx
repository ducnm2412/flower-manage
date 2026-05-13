import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserManagement from "../components/UserManagement";
import MyFlowers from "./MyFlowers";
import SearchFlowers from "./SearchFlowers";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("my-flowers");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Kiểm tra xem user đã đăng nhập và có quyền admin chưa
    const userId = localStorage.getItem("userId");
    const userRole = localStorage.getItem("userRole");

    if (!userId || userRole !== "admin") {
      navigate("/");
      return;
    }

    // Lấy thông tin user từ localStorage
    const userName = localStorage.getItem("userName");
    setUser({
      id: userId,
      name: userName,
      role: userRole,
    });
  }, [navigate]);

  const handleLogout = () => {
    // Xóa thông tin user từ localStorage
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userYear");

    // Chuyển hướng tới trang login
    navigate("/");
  };

  if (!user) {
    return <div className="loading">Đang tải...</div>;
  }

  return (
    <div className="admin-dashboard">
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-brand">
            <h2>🌸 Admin Panel</h2>
          </div>
          <div className="navbar-right">
            <span className="user-name">{user.name}</span>
            <button onClick={handleLogout} className="logout-btn">
              Đăng xuất
            </button>
          </div>
        </div>
      </nav>

      <div className="admin-container">
        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === "my-flowers" ? "active" : ""}`}
            onClick={() => setActiveTab("my-flowers")}
          >
            🌸 Hoa của tôi
          </button>
          <button
            className={`tab-btn ${activeTab === "search" ? "active" : ""}`}
            onClick={() => setActiveTab("search")}
          >
            🔍 Tra cứu hoa
          </button>
          <button
            className={`tab-btn ${activeTab === "user-management" ? "active" : ""}`}
            onClick={() => setActiveTab("user-management")}
          >
            👥 Quản lý người dùng
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "my-flowers" && <MyFlowers />}
          {activeTab === "search" && <SearchFlowers />}
          {activeTab === "user-management" && <UserManagement />}
        </div>
      </div>
    </div>
  );
}
