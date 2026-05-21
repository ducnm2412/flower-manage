import React, { useState, useRef, useEffect } from "react";
import "./FlowerCard.css";

export default function FlowerCard({
  flower,
  onEdit,
  onDelete,
  showActions = true,
}) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const colorMap = {
    red: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
    purple: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
    orange: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
    blue: "linear-gradient(135deg, #5ee7df 0%, #4facfe 100%)",
    green: "linear-gradient(135deg, #96f6a6 0%, #55efc4 100%)",
  };

  const defaultGradient = "linear-gradient(135deg, #f6d365 0%, #fda085 100%)";
  const bgGradient = colorMap[flower.backgroundColor] || defaultGradient;

  const overlayRGBMap = {
    red: "160, 20, 50",
    purple: "90, 30, 150",
    orange: "180, 80, 10",
    blue: "20, 90, 180",
    green: "20, 130, 80",
  };

  const overlayRgb = overlayRGBMap[flower.backgroundColor] || "0, 0, 0";

  return (
    <div className="flower-card" style={{ "--overlay-rgb": overlayRgb }}>
      {flower.imageUrl ? (
        <img
          src={flower.imageUrl}
          alt={flower.name}
          className="flower-image-bg"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div
          className="flower-image-placeholder"
          style={{ background: bgGradient }}
        />
      )}

      <div className="flower-card-overlay"></div>

      <div className="flower-card-content">
        {showActions && (
          <div className="flower-menu-wrapper" ref={menuRef}>
            <button
              type="button"
              className="flower-menu-btn"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              title="Tùy chọn"
            >
              ⋮
            </button>

            {showMenu && (
              <div className="flower-dropdown">
                {onEdit && (
                  <button
                    type="button"
                    className="dropdown-item"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                      onEdit(flower);
                    }}
                  >
                    Sửa
                  </button>
                )}

                {onDelete && (
                  <button
                    type="button"
                    className="dropdown-item delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                      onDelete(flower.id);
                    }}
                  >
                    Xóa
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        <div className="flower-info">
          <span className="flower-rank">
            {["red", "purple", "orange", "blue", "green"].includes(
              flower.backgroundColor,
            )
              ? ""
              : "Khác"}
          </span>
        </div>

        {flower.event && (
          <p className="flower-event">
            <strong>Sự kiện:</strong> {flower.event}
          </p>
        )}
      </div>
    </div>
  );
}
