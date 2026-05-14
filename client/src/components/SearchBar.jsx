import React, { useState } from "react";
import "./SearchBar.css";

export default function SearchBar({ onSearch, searchType = "name" }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState(searchType);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch({
        type,
        query: query.trim(),
      });
    }
  };

  const handleClear = () => {
    setQuery("");
    onSearch({
      type,
      query: "",
    });
  };

  return (
    <form className="search-bar" onSubmit={handleSearch}>
      <div className="search-inputs">
        <div className="search-field">
          <label htmlFor="searchType">Tìm kiếm theo:</label>
          <select
            id="searchType"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="search-select"
          >
            <option value="name">Tên hoa</option>
            <option value="color">Màu nền</option>
            <option value="username">Tên chủ nhân</option>
          </select>
        </div>

        <div className="search-field">
          <label htmlFor="searchQuery">Từ khóa:</label>
          <input
            type="text"
            id="searchQuery"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              type === "name"
                ? "Nhập tên hoa..."
                : type === "color"
                  ? "Nhập màu (ví dụ: đỏ, tím, cam)..."
                  : "Nhập tên chủ nhân..."
            }
            className="search-input"
          />
        </div>
      </div>

      <div className="search-actions">
        <button type="submit" className="btn btn-search">
          🔍 Tìm kiếm
        </button>
        {query && (
          <button type="button" className="btn btn-clear" onClick={handleClear}>
            ✕ Xóa
          </button>
        )}
      </div>
    </form>
  );
}
