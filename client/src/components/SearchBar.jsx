import React, { useState } from "react";
import "./SearchBar.css";

export default function SearchBar({
  onSearch,
  searchType = "name",
  ownerOptions = [],
  ownersLoading = false,
  onTypeChange,
}) {
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

  const handleTypeChange = (nextType) => {
    setType(nextType);
    setQuery("");
    onTypeChange?.(nextType);
  };

  return (
    <form className="search-bar" onSubmit={handleSearch}>
      <div className="search-inputs">
        <div className="search-field">
          <label htmlFor="searchType">Tìm kiếm theo:</label>
          <select
            id="searchType"
            value={type}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="search-select"
          >
            <option value="name">Tên hoa</option>
            <option value="color">Màu nền</option>
            <option value="username">Chủ nhân (ingame)</option>
          </select>
        </div>

        <div className="search-field">
          <label htmlFor="searchQuery">
            {type === "username" ? "Chọn ingame:" : "Từ khóa:"}
          </label>
          {type === "username" ? (
            <select
              id="searchQuery"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="search-select"
              disabled={ownersLoading}
            >
              <option value="">
                {ownersLoading ? "Đang tải ingame..." : "Chọn ingame"}
              </option>
              {ownerOptions.map((owner) => (
                <option key={owner.ingame} value={owner.ingame}>
                  {owner.name ? `${owner.ingame} - ${owner.name}` : owner.ingame}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              id="searchQuery"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                type === "name"
                  ? "Nhập tên hoa..."
                  : "Nhập màu (ví dụ: đỏ, tím, cam, lam, lục)..."
              }
              className="search-input"
            />
          )}
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
