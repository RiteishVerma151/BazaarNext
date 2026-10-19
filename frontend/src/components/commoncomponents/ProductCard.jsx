import { useState } from "react";
import styles from "../../styles/commonComponent/ProductCard.module.css";

export default function ProductCard({ product }) {
  const [wished, setWished] = useState(false);
  const { name, price, condition, info, color, image } = product;

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
        <h3>{name}</h3>
        <span className={styles.meta}>{info}</span>
        <div className={styles.prodRow}>
          <span className={styles.price}>₹{price.toLocaleString("en-IN")}</span>
          <a href="#">View details</a>
        </div>
      </div>
    </article>
  );
}