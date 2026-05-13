import React from "react";
import "./FlowerCard.css";

export default function FlowerCard({
  flower,
  onEdit,
  onDelete,
  showActions = true,
}) {
  const colorMap = {
    red: "#ff4d4f",
    purple: "#9254de",
    orange: "#fa8c16",
  };

  return (
    <div
      className="flower-card"
      style={{
        backgroundColor: colorMap[flower.backgroundColor] || "#ffffff",
      }}
    >
      <div className="flower-card-content">
        {flower.imageUrl && (
          <img
            src={flower.imageUrl}
            alt={flower.name}
            className="flower-image"
          />
        )}
        <h3 className="flower-name">🌸 {flower.name}</h3>

        {flower.description && (
          <p className="flower-description">{flower.description}</p>
        )}

        {/* Owners */}
        {flower.owners && (
          <div className="flower-owners">
            <p className="owners-label">Chủ sở hữu:</p>

            <div className="owners-list">
              {flower.owners.map((owner, idx) => (
                <span key={idx} className="owner-badge">
                  🎮 {owner.ingame}
                  <br />
                  👤 {owner.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flower-actions">
            <button
              className="btn btn-edit"
              onClick={() => onEdit(flower)}
              title="Sửa"
            >
              Sửa
            </button>

            <button
              className="btn btn-delete"
              onClick={() => onDelete(flower.id)}
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
