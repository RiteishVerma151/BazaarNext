
import { Link } from "react-router-dom";
import styles from "../../styles/wishlist/WishlistCard.module.css";

const getImageUrl = (path) => {
  if (!path) return "";

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `https://bazaarnext.onrender.com${path.startsWith("/") ? "" : "/"}${path}`;
};

export default function WishlistCard({ item, onRemove }) {
  const productId = item._id ?? item.id;
  const image = item.images?.[0] ?? item.image;
  const title = item.title ?? item.name ?? "Untitled product";
  const price = Number(item.price ?? 0);
  const condition =
    item.condition === "Like New" ? "Like new" : item.condition;

  // The backend schema uses GeoJSON coordinates, not a location label.
  // Show seller name when a readable location is unavailable.
  const info =
    typeof item.location === "string"
      ? item.location
      : item.seller?.name || "Location not specified";

  return (
    <div className={styles.card}>
      <div className={styles.imageWrap}>
        {image ? (
          <img
            src={getImageUrl(image)}
            alt={title}
            className={styles.image}
          />
        ) : (
          <div className={styles.image}>No image available</div>
        )}

        <button
          type="button"
          className={styles.removeBtn}
          onClick={onRemove}
          aria-label="Remove from wishlist"
          title="Remove from wishlist"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        <span className={styles.badge}>{condition}</span>
      </div>

      <div className={styles.body}>
        <span className={styles.category}>{item.category}</span>

        <h3 className={styles.name}>{title}</h3>

        <div className={styles.priceRow}>
          <span className={styles.price}>
            ₹{price.toLocaleString("en-IN")}
          </span>

          <span className={styles.location}>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>

            {info}
          </span>
        </div>

        <Link to={`/product/${productId}`} className={styles.buyBtn}>
          View Item
        </Link>
      </div>
    </div>
  );
}
