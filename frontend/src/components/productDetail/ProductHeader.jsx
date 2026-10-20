import styles from "../../styles/productDetail/ProductHeader.module.css";

export default function ProductHeader({ name, location, price }) {
  return (
    <>
      <h1 className={styles.title}>{name}</h1>

      <div className={styles.meta}>
        <span className={styles.location}>
          <svg
            width="14"
            height="14"
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
          {location}
        </span>
        <span className={styles.posted}>Posted recently</span>
      </div>

      <div className={styles.priceRow}>
        <span className={styles.price}>₹{price.toLocaleString("en-IN")}</span>
        <span className={styles.negotiable}>Negotiable</span>
      </div>
    </>
  );
}