import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MyFlowers from "./MyFlowers";
import SearchFlowers from "./SearchFlowers";
import "./Dashboard.css";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("my-flowers");
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Kiểm tra xem user đã đăng nhập chưa
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate("/");
      return;
    }

    // Lấy thông tin user từ localStorage
    const userName = localStorage.getItem("userName");
    const userRole = localStorage.getItem("userRole");
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
              className={`nav-link ${activeTab === "my-flowers" ? "active" : ""}`}
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
    </div>
  );
}
