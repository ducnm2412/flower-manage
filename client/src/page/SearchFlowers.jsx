import React, { useState } from "react";
import api from "../services/api";
import FlowerCard from "../components/FlowerCard";
import SearchBar from "../components/SearchBar";
import "./SearchFlowers.css";

export default function SearchFlowers() {
  const [flowers, setFlowers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchParams, setSearchParams] = useState({
    type: "name",
    query: "",
  });
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedFlower, setSelectedFlower] = useState(null);

  // Map Vietnamese color names to English
  const colorMap = {
    đỏ: "red",
    red: "red",
    tím: "purple",
    purple: "purple",
    cam: "orange",
    orange: "orange",
    lam: "blue",
    "xanh lam": "blue",
    blue: "blue",
    lục: "green",
    luc: "green",
    "xanh lục": "green",
    "xanh luc": "green",
    green: "green",
  };

  const handleSearch = async (params) => {
    setSearchParams(params);
    setHasSearched(true);
    setSelectedFlower(null);
    setLoading(true);
    setError("");

    try {
      const query = params.query.trim();

      if (!query) {
        setFlowers([]);
        return;
      }

      let response;
      if (params.type === "name") {
        response = await api.get(
          `/flowers/search/name/${encodeURIComponent(query)}`,
        );
      } else if (params.type === "color") {
        // Convert Vietnamese color name to English
        const normalizedQuery = query.toLowerCase();
        const colorQuery = colorMap[normalizedQuery] || normalizedQuery;
        response = await api.get(
          `/flowers/search/color/${encodeURIComponent(colorQuery)}`,
        );
      } else if (params.type === "username") {
        response = await api.get(
          `/flowers/username/${encodeURIComponent(query)}`,
        );
      }

      setFlowers(response.data || []);
    } catch (err) {
      setError(
        "Không thể tìm kiếm hoa: " + (err.response?.data?.error || err.message),
      );
      setFlowers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFlowerClick = (flower) => {
    if (searchParams.type === "name") {
      setSelectedFlower(flower);
    }
  };

  return (
    <div className="search-flowers">
      <div className="page-header">
        <h1>Tra cứu hoa</h1>
      </div>

      <SearchBar onSearch={handleSearch} />

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading">Đang tìm kiếm hoa...</div>
      ) : hasSearched && flowers.length === 0 ? (
        <div className="empty-state">
          <p>
            Không tìm thấy hoa nào{" "}
            {searchParams.type === "name"
              ? `với tên "${searchParams.query}"`
              : searchParams.type === "color"
                ? `với màu nền "${searchParams.query}"`
                : `của chủ nhân "${searchParams.query}"`}
          </p>
        </div>
      ) : hasSearched ? (
        <div className="search-results">
          <p className="results-info">
            Tìm thấy <strong>{flowers.length}</strong> hoa
          </p>
          <div className="flowers-grid">
            {flowers.map((flower) => (
              <div
                key={flower.id}
                className={
                  searchParams.type === "name"
                    ? "search-flower-card clickable"
                    : "search-flower-card"
                }
                onClick={() => handleFlowerClick(flower)}
                role={searchParams.type === "name" ? "button" : undefined}
                tabIndex={searchParams.type === "name" ? 0 : undefined}
                onKeyDown={(e) => {
                  if (
                    searchParams.type === "name" &&
                    (e.key === "Enter" || e.key === " ")
                  ) {
                    e.preventDefault();
                    handleFlowerClick(flower);
                  }
                }}
              >
                <FlowerCard flower={flower} showActions={false} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="initial-state">
          <p>Sử dụng tìm kiếm ở trên để tìm hoa</p>
        </div>
      )}

      {selectedFlower && (
        <div
          className="owner-modal-overlay"
          onClick={() => setSelectedFlower(null)}
        >
          <div className="owner-modal" onClick={(e) => e.stopPropagation()}>
            <div className="owner-modal-header">
              <h2>{selectedFlower.name}</h2>
              <button
                type="button"
                className="owner-modal-close"
                onClick={() => setSelectedFlower(null)}
              >
                ×
              </button>
            </div>

            <div className="owner-modal-body">
              <h3>Chủ sở hữu</h3>
              {selectedFlower.owners?.length ? (
                <div className="owner-ingame-list">
                  {selectedFlower.owners.map((owner, index) => (
                    <span
                      key={`${owner.ingame || "owner"}-${index}`}
                      className="owner-ingame-badge"
                    >
                      {owner.ingame || "Không có ingame"}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="owner-empty">Chưa có chủ sở hữu</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
