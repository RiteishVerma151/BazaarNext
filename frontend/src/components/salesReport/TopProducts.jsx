import { Link } from "react-router-dom";
import styles from "../../styles/salesReport/TopProducts.module.css";

const TOP_PRODUCTS = [
  { id: 1, name: "Premium leather backpack", sold: 7, revenue: 8750, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=100&q=80" },
  { id: 2, name: "Hero cycle 26T", sold: 3, revenue: 8400, image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=100&q=80" },
  { id: 3, name: "Study table (Wooden)", sold: 5, revenue: 6000, image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=100&q=80" },
  { id: 4, name: "Table fan", sold: 3, revenue: 2700, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=100&q=80" },
];

export default function TopProducts() {
  return (
    <div className={styles.topCard}>
      <div className={styles.cardHeader}>
        <div>
          <h2>Top Products</h2>
          <p>Best sellers by revenue</p>
        </div>
        <Link to="/my-listings" className={styles.viewAll}>View all →</Link>
      </div>

      {/* 👇 Scroll wrapper */}
      <div className={styles.topScroll}>
        <div className={styles.topList}>
          {TOP_PRODUCTS.map((p, i) => (
            <div key={p.id} className={styles.topItem}>
              <span className={styles.topRank}>#{i + 1}</span>
              <img src={p.image} alt={p.name} className={styles.topImg} />
              <div className={styles.topInfo}>
                <p className={styles.topName}>{p.name}</p>
                <p className={styles.topMeta}>{p.sold} sold</p>
              </div>
              <span className={styles.topRevenue}>₹{p.revenue.toLocaleString("en-IN")}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}