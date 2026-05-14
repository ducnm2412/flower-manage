import React, { useState, useEffect } from "react";
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

  // Map Vietnamese color names to English
  const colorMap = {
    đỏ: "red",
    red: "red",
    tím: "purple",
    purple: "purple",
    cam: "orange",
    orange: "orange",
  };

  const handleSearch = async (params) => {
    setSearchParams(params);
    setHasSearched(true);
    setLoading(true);
    setError("");

    try {
      if (!params.query) {
        setFlowers([]);
        return;
      }

      let response;
      if (params.type === "name") {
        response = await api.get(`/flowers/search/name/${params.query}`);
      } else if (params.type === "color") {
        // Convert Vietnamese color name to English
        const colorQuery =
          colorMap[params.query.toLowerCase()] || params.query.toLowerCase();
        response = await api.get(`/flowers/search/color/${colorQuery}`);
      } else if (params.type === "username") {
        response = await api.get(`/flowers/username/${params.query}`);
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
              <FlowerCard key={flower.id} flower={flower} showActions={false} />
            ))}
          </div>
        </div>
      ) : (
        <div className="initial-state">
          <p>Sử dụng tìm kiếm ở trên để tìm hoa</p>
        </div>
      )}
    </div>
  );
}
