import styles from "../../styles/ProductDetail/ProductSellerCard.module.css";

export default function ProductSellerCard() {
  return (
    <div className={styles.sellerCard}>
      <div className={styles.sellerAvatar}>RS</div>
      <div className={styles.sellerInfo}>
        <h4>Rahul S.</h4>
        <p>⭐ 4.8 • Joined March 2023</p>
      </div>
    </div>
  );
}