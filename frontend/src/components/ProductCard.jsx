import { useState } from "react";
import "../styles/ProductCard.css";

export default function ProductCard({ product }) {
  const [wished, setWished] = useState(false);
  const { name, price, condition, info, color, image } = product;

  return (
    <article className="prod">
      <div className="prod-img" style={{ background: color }}>
        <img src={image} alt={name} />
        <span className="cond">{condition}</span>
        <button
          className={`wish ${wished ? "on" : ""}`}
          aria-pressed={wished}
          aria-label={`Add ${name} to wishlist`}
          onClick={() => setWished(!wished)}
        >
          ♥
        </button>
      </div>
      <div className="prod-body">
        <h3>{name}</h3>
        <span className="meta">{info}</span>
        <div className="prod-row">
          <span className="price">₹{price.toLocaleString("en-IN")}</span>
          <a href="#">View details</a>
        </div>
      </div>
    </article>
  );
}
