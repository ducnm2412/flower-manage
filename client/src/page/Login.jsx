import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

import "./Login.css";

export default function Login() {
  const [ingame, setIngame] = useState("");
  const [userOptions, setUserOptions] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();

    const fetchUserOptions = async () => {
      setUsersLoading(true);

      try {
        const response = await api.get("/auth/user-options", {
          signal: controller.signal,
        });

        setUserOptions(response.data || []);
      } catch (err) {
        if (err.name !== "CanceledError" && err.code !== "ERR_CANCELED") {
          setError(
            "KhÃ´ng thá»ƒ táº£i danh sÃ¡ch tÃªn bÃ© ngoan: " +
              (err.response?.data?.error || err.message),
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setUsersLoading(false);
        }
      }
    };

    fetchUserOptions();

    return () => controller.abort();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      // Validate
      if (!ingame.trim() || !password.trim()) {
        setError("Ingame và password không được để trống");

        setLoading(false);

        return;
      }

      // API LOGIN
      const response = await api.post("/auth/login", {
        ingame: ingame.trim(),
        password: password.trim(),
      });

      // Save localStorage
      localStorage.setItem("userId", response.data.user.id);

      localStorage.setItem("userIngame", response.data.user.ingame);

      localStorage.setItem("userName", response.data.user.name);

      localStorage.setItem("userRole", response.data.user.role);

      localStorage.setItem("userYear", response.data.user.year);

      // Redirect
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

        <p className="subtitle">
          Đăng nhập để quản lý hoa
        </p>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form
          onSubmit={handleLogin}
          className="login-form"
        >
          {/* Ingame */}
          <div className="form-group">
            <label htmlFor="ingame">
              Tên bé ngoan *
            </label>

            <select
              id="ingame"
              value={ingame}
              onChange={(e) =>
                setIngame(e.target.value)
              }
              disabled={loading || usersLoading}
            >
              <option value="">
                {usersLoading ? "Đang tải tên bé ngoan..." : "Chọn tên bé ngoan"}
              </option>
              {userOptions.map((user) => (
                <option key={user.ingame} value={user.ingame}>
                  {user.name ? `${user.ingame} - ${user.name}` : user.ingame}
                </option>
              ))}
            </select>
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">
              Password *
            </label>

            <div className="password-wrapper">
              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                id="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Nhập password"
                disabled={loading}
              />

              <button
                type="button"
                className="toggle-password"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-login"
            disabled={loading}
          >
            {loading
              ? "Đang đăng nhập..."
              : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
}
