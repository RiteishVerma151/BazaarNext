import { Link } from "react-router-dom";
import styles from "../../styles/myListings/ListingCard.module.css";

const getImageUrl = (path) => {
  if (!path) return "";

  if (/^https?:\/\//i.test(path)) return path;

  const baseURL = "http://localhost:3001";
  return `${baseURL}${path.startsWith("/") ? "" : "/"}${path}`;
};

export default function ListingCard({ listing, onDelete }) {
  const id = listing.id ?? listing._id;
  const image = listing.images?.[0] ?? listing.image;
  const status = listing.status === "AVAILABLE" ? "Active" : "Sold";
  const condition =
    listing.condition === "Like New" ? "Like new" : listing.condition;

  return (
    <div className={styles.card}>
      <div className={styles.imageWrap}>
        {image ? (
          <img
            src={getImageUrl(image)}
            alt={listing.title}
            className={styles.image}
          />
        ) : (
          <div className={styles.image}>No image available</div>
        )}

        <span
          className={`${styles.statusBadge} ${
            status === "Active" ? styles.statusActive : styles.statusSold
          }`}
        >
          {status}
        </span>

        <span className={styles.conditionBadge}>{condition}</span>
      </div>

      <div className={styles.body}>
        <span className={styles.category}>{listing.category}</span>

        <h3 className={styles.title}>{listing.title}</h3>

        <span className={styles.price}>
          ₹{Number(listing.price ?? 0).toLocaleString("en-IN")}
        </span>

        <div className={styles.statsRow}>
          <div className={styles.statBox}>
            <span className={styles.statValue}>
              {listing.status === "SOLD" ? "0" : "—"}
            </span>
            <span className={styles.statLabel}>Stock</span>
          </div>

          <div className={styles.statBox}>
            <span className={styles.statValue}>
              {listing.soldCount ?? "—"}
            </span>
            <span className={styles.statLabel}>Sold</span>
          </div>

          <div className={styles.statBox}>
            <span className={styles.statValue}>
              {listing.soldCount ?? "—"}
            </span>
            <span className={styles.statLabel}>Sold count</span>
          </div>
        </div>

        <div className={styles.actions}>
          {listing.status === "AVAILABLE" && (
            <Link to={`/sell/${id}`} className={styles.editBtn}>
              Edit
            </Link>
          )}

          <button
            type="button"
            onClick={onDelete}
            className={styles.deleteBtn}
            aria-label={`Remove ${listing.title}`}
            title="Remove listing"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}