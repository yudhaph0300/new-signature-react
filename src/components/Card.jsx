import React from "react";

function Card({ imageSource, title, type, rating, description, price }) {
  return (
    <div className="card card-furniture shadow">
      <div className="card-img-container">
        <div className="card-img-overlay">
          <span className="card-title fw-bold card-tag me-2 shadow-sm">
            ${price}
          </span>
          <span className="card-title fw-bold card-tag shadow-sm">{type}</span>
        </div>
        <div className="card-img-wrapper">
          <img
            className="card-img-top"
            src={imageSource}
            height="200"
            alt={title}
            style={{
              objectFit: "cover",
            }}
          />
        </div>
      </div>
      <div className="card-body">
        <p className="mb-1 fw-bold">{title}</p>
      </div>
    </div>
  );
}

export default Card;
