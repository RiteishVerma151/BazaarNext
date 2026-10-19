import { Link } from "react-router-dom";
import styles from "../../styles/myOrders/OrderCard.module.css";

export default function OrderCard({ order }) {
  const getStatusClass = (status) => {
    if (status === "Delivered") return styles.statusDelivered;
    if (status === "Processing") return styles.statusProcessing;
    if (status === "Out for Delivery") return styles.statusOutForDelivery;
    if (status === "Cancelled") return styles.statusCancelled;
    return "";
  };

  return (
    <div className={styles.orderCard}>
      {/* Top Header */}
      <div className={styles.cardHeader}>
        <div className={styles.orderInfo}>
          <span className={styles.orderId}>Order #{order.id}</span>
          <span className={styles.orderDate}>Placed on {order.date}</span>
        </div>
        <div className={`${styles.statusBadge} ${getStatusClass(order.status)}`}>
          {order.status}
        </div>
      </div>

      {/* Body: Product Details */}
      <div className={styles.cardBody}>
        {order.items.map((item, index) => (
          <div key={index} className={styles.productRow}>
            <img src={item.image} alt={item.name} className={styles.productImg} />
            <div className={styles.productDetails}>
              <h3>{item.name}</h3>
              <p className={styles.price}>₹{item.price.toLocaleString("en-IN")}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer: Total & Actions */}
      <div className={styles.cardFooter}>
        <div className={styles.totalAmount}>
          <span>Total Amount:</span>
          <strong>₹{order.total.toLocaleString("en-IN")}</strong>
        </div>
        
        <div className={styles.actions}>
          <Link to={`/product/1`} className={styles.viewDetailsBtn}>
            View Item
          </Link>
          
          {order.status === "Delivered" && (
            <button className={styles.buyAgainBtn}>Buy Again</button>
          )}

          {(order.status === "Processing" || order.status === "Out for Delivery") && (
            <button className={styles.cancelBtn}>Cancel Order</button>
          )}
        </div>
      </div>
    </div>
  );
}