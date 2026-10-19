import { Link } from "react-router-dom";
import styles from "../../styles/wishlist/WishlistCard.module.css";

export default function WishlistCard({ item, onRemove }) {
  return (
    <div className={styles.card}>
      {/* Image Area */}
      <div className={styles.imageWrap}>
        <img src={item.image} alt={item.name} className={styles.image} />
        <button 
          className={styles.removeBtn} 
          onClick={onRemove}
          aria-label="Remove from wishlist"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
        <span className={styles.badge}>{item.condition}</span>
      </div>

      {/* Details Area */}
      <div className={styles.body}>
        <span className={styles.category}>{item.category}</span>
        <h3 className={styles.name}>{item.name}</h3>
        
        <div className={styles.priceRow}>
          <span className={styles.price}>₹{item.price.toLocaleString("en-IN")}</span>
          <span className={styles.location}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {item.info}
          </span>
        </div>

        <Link to={`/product/${item.id}`} className={styles.buyBtn}>
          View Item
        </Link>
      </div>
    </div>
  );
}