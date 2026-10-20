import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext"; // 👈 Import
import styles from "../../styles/myListings/ListingCard.module.css";

export default function ListingCard({ listing, onDelete, onMarkSold }) {
  const { addToCart } = useCart();      // 👈 Hook
  const [toast, setToast] = useState(false); // 👈 Toast state

  const getStatusClass = (status) => {
    if (status === "Active") return styles.statusActive;
    if (status === "Sold") return styles.statusSold;
    return "";
  };

  const getPerformance = () => {
    const { sold, stock, status } = listing;
    const total = sold + stock;

    if (status === "Sold") return { label: "✅ All sold", class: styles.perfSold };
    if (total === 0) return null;
    
    const sellRate = sold / total;
    
    if (sellRate >= 0.6) return { label: "🔥 Trending", class: styles.perfHot };
    if (sellRate >= 0.3) return { label: "📈 Medium", class: styles.perfMedium };
    return { label: "⚠️ Low interest", class: styles.perfLow };
  };

  // 👇 Add to Cart handler
  const handleAddToCart = () => {
    addToCart(listing);       // Context me save
    setToast(true);           // Toast dikhao
    setTimeout(() => setToast(false), 2500);
  };

  const perf = getPerformance();

  return (
    <div className={styles.card}>
      <div className={styles.imageWrap}>
        <img src={listing.image} alt={listing.title} className={styles.image} />
        <span className={`${styles.statusBadge} ${getStatusClass(listing.status)}`}>
          {listing.status}
        </span>
        <span className={styles.conditionBadge}>{listing.condition}</span>
      </div>

      <div className={styles.body}>
        <span className={styles.category}>{listing.category}</span>
        <h3 className={styles.title}>{listing.title}</h3>

        <span className={styles.price}>₹{listing.price.toLocaleString("en-IN")}</span>

        {/* 3 STATS */}
        <div className={styles.statsRow}>
          <div className={styles.statBox}>
            <span className={styles.statValue}>
              {listing.stock > 0 ? listing.stock : "0"}
            </span>
            <span className={styles.statLabel}>Stock</span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statValue}>{listing.sold}</span>
            <span className={styles.statLabel}>Sold</span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statValue}>
              {listing.sold + listing.stock}
            </span>
            <span className={styles.statLabel}>Total</span>
          </div>
        </div>

        {perf && (
          <div className={`${styles.perfTag} ${perf.class}`}>
            {perf.label}
          </div>
        )}

        {/* 👇 ADD TO CART BUTTON (sirf Active + stock > 0 pe) */}
        {listing.status === "Active" && listing.stock > 0 && (
          <button onClick={() => {
            addToCart(product);
            setToast(true);
            setTimeout(() => setToast(false), 2500);
            }}>
  Add to Cart
</button>
        )}

        {/* Actions */}
        <div className={styles.actions}>
          {listing.status !== "Sold" && (
            <Link to={`/sell/${listing.id}`} className={styles.editBtn}>
              Edit
            </Link>
          )}
          <button onClick={onDelete} className={styles.deleteBtn} aria-label="Delete">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>

      {/* 👇 TOAST (popup) */}
      {toast && (
        <div className={styles.toast}>
          <span>✅ Added to cart</span>
          <Link to="/cart" className={styles.toastLink}>View Cart →</Link>
        </div>
      )}
    </div>
  );
}