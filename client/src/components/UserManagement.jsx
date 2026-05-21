import { useState, useEffect } from "react";
import api from "../services/api";
import UserForm from "./UserForm";
import "./UserManagement.css";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const userRole = localStorage.getItem("userRole");

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/auth/users", {
        headers: {
          "x-user-role": userRole,
        },
      });
      setUsers(response.data);
    } catch (err) {
      setError(
        err.response?.data?.error || "Không thể tải danh sách người dùng",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle delete user
  const handleDeleteUser = async (userId) => {
    try {
      setError("");
      await api.delete(`/auth/users/${userId}`, {
        headers: {
          "x-user-role": userRole,
        },
      });
      setSuccess("Xóa người dùng thành công");
      fetchUsers();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Không thể xóa người dùng");
    }
  };

  // Handle edit user
  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };

  // Handle close form
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingUser(null);
  };

  // Handle form submit
  const handleFormSubmit = () => {
    setShowForm(false);
    setEditingUser(null);
    setSuccess(
      editingUser
        ? "Cập nhật người dùng thành công"
        : "Tạo người dùng thành công",
    );
    fetchUsers();
    setTimeout(() => setSuccess(""), 3000);
  };

  // Filter users based on search term
  const filteredUsers = users
    .filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.ingame.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) =>
      (a.name || a.ingame || "").localeCompare(b.name || b.ingame || "", "vi", {
        sensitivity: "base",
      }),
    );

  return (
    <div className="user-management">
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="user-management-header">
        <h3>Danh sách người dùng</h3>
        <button
          className="btn-add"
          onClick={() => {
            setEditingUser(null);
            setShowForm(true);
          }}
        >
          ➕ Thêm người dùng mới
        </button>
      </div>

      <div className="search-section">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên hoặc ingame..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : filteredUsers.length === 0 ? (
        <div className="no-users">Không có người dùng nào</div>
      ) : (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Đăng nhập</th>
                <th>Tên người dùng</th>
                <th>Năm tham gia</th>
                <th>Vai trò</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="user-row">
                  <td className="user-ingame">
                    <strong>{user.ingame}</strong>
                  </td>
                  <td className="user-name">{user.name}</td>
                  <td className="user-year">{user.year}</td>
                  <td className="user-role">
                    <span className={`role-badge role-${user.role}`}>
                      {user.role === "admin" ? "🚫 Admin" : "👤 User"}
                    </span>
                  </td>
                  <td className="user-actions">
                    <button
                      className="btn-edit"
                      onClick={() => handleEditUser(user)}
                      title="Sửa"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteUser(user.id)}
                      title="Xóa"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <UserForm
          user={editingUser}
          onClose={handleCloseForm}
          onSubmit={handleFormSubmit}
          userRole={userRole}
        />
      )}
    </div>
  );
}
