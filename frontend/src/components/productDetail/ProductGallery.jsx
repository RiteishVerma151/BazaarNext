import styles from "../../styles/ProductDetail/ProductGallery.module.css";

export default function ProductGallery() {
  return (
    <div className={styles.imageArea} style={{ backgroundColor: "#7c4fd4" }}>
      <span className={styles.conditionBadge}>Like new</span>
      <button className={styles.wishlistBtn} aria-label="Add to wishlist">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>
      <img 
        src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80" 
        alt="Premium backpack" 
        className={styles.mainImage} 
      />
    </div>
  );
}