import styles from "../../styles/ProductDetail/ProductSellerCard.module.css";

export default function ProductSellerCard({ seller }) {
  const name = seller?.name || seller?.username || "BazaarNext Seller";

  const rating = Number(seller?.avgRating);
  const ratingCount = Number(seller?.ratingCount ?? 0);

  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className={styles.sellerCard}>
      <div className={styles.sellerAvatar}>{initials || "S"}</div>

      <div className={styles.sellerInfo}>
        <h4>{name}</h4>

        {ratingCount > 0 && Number.isFinite(rating) ? (
          <p>
            ⭐ {rating.toFixed(1)} · {ratingCount}{" "}
            {ratingCount === 1 ? "review" : "reviews"}
          </p>
        ) : (
          <p>New seller</p>
        )}
      </div>
    </div>
  );
}