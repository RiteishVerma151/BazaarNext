import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/commonComponent/ProductCard.module.css";

export default function ProductCard({ product }) {
  const [wished, setWished] = useState(false);
  const { id, name, price, condition, info, color, image } = product;

  return (
    <article className={styles.prod}>
      <div className={styles.prodImg} style={{ background: color }}>
        <img src={image} alt={name} />
        <span className={styles.cond}>{condition}</span>
        <button
          className={`${styles.wish} ${wished ? styles.on : ""}`}
          aria-pressed={wished}
          aria-label={`Add ${name} to wishlist`}
          onClick={() => setWished(!wished)}
        >
          ♥
        </button>
      </div>
      <div className={styles.prodBody}>
        <h3>
          <Link to={`/product/${id}`}>{name}</Link>
        </h3>
        <span className={styles.meta}>{info}</span>
        <div className={styles.prodRow}>
          <span className={styles.price}>₹{price.toLocaleString("en-IN")}</span>
          <Link to={`/product/${id}`}>View details</Link>
        </div>
      </div>
    </article>
  );
}