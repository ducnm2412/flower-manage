import React from "react";
import "./FlowerCard.css";

export default function FlowerCard({
  flower,
  onEdit,
  onDelete,
  showActions = true,
}) {
  const colorMap = {
    red: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)",
    purple: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
    orange: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
  };

  const defaultGradient = "linear-gradient(135deg, #f6d365 0%, #fda085 100%)";
  const bgGradient = colorMap[flower.backgroundColor] || defaultGradient;

  const overlayRGBMap = {
    red: "160, 20, 50",
    purple: "90, 30, 150",
    orange: "180, 80, 10",
  };
  const overlayRgb = overlayRGBMap[flower.backgroundColor] || "0, 0, 0";

  return (
    <div className="flower-card" style={{ "--overlay-rgb": overlayRgb }}>
      {flower.imageUrl ? (
        <img
          src={flower.imageUrl}
          alt={flower.name}
          className="flower-image-bg"
        />
      ) : (
        <div
          className="flower-image-placeholder"
          style={{ background: bgGradient }}
        ></div>
      )}

      {/* Background fade effects */}
      <div className="flower-card-overlay"></div>

      {/* Content */}
      <div className="flower-card-content">
        <div className="flower-info">
          <span className="flower-rank">
            {flower.backgroundColor === "red"
              ? ""
              : flower.backgroundColor === "purple"
                ? ""
                : flower.backgroundColor === "orange"
                  ? ""
                  : "Khác"}
          </span>
        </div>

        {flower.event && (
          <p className="flower-event">
            <strong>Sự kiện:</strong> {flower.event}
          </p>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flower-actions">
            <button
              className="btn btn-edit btn-sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(flower);
              }}
              title="Sửa"
            >
              Sửa
            </button>

            <button
              className="btn btn-delete btn-sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(flower.id);
              }}
              title="Xóa"
            >
              Xóa
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
