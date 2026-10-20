import { Link } from "react-router-dom";
import styles from "../../styles/salesReport/RecentOrders.module.css";

const RECENT_ORDERS = [
  { id: "ORD-1024", buyer: "Amit K.", item: "Premium leather backpack", amount: 1250, status: "Delivered", date: "Oct 18" },
  { id: "ORD-1023", buyer: "Priya S.", item: "Hero cycle 26T", amount: 2800, status: "Shipped", date: "Oct 17" },
  { id: "ORD-1022", buyer: "Rahul M.", item: "Study table", amount: 1200, status: "Delivered", date: "Oct 16" },
  { id: "ORD-1021", buyer: "Neha P.", item: "Table fan", amount: 900, status: "Processing", date: "Oct 15" },
];

export default function RecentOrders() {
  const getStatusClass = (status) => {
    if (status === "Delivered") return styles.statusDelivered;
    if (status === "Shipped") return styles.statusShipped;
    return styles.statusProcessing;
  };

  return (
    <div className={styles.ordersCard}>
      <div className={styles.cardHeader}>
        <div>
          <h2>Recent Orders</h2>
          <p>Your latest transactions</p>
        </div>
        <Link to="/my-orders" className={styles.viewAll}>View all →</Link>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Buyer</th>
              <th>Item</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {RECENT_ORDERS.map((o) => (
              <tr key={o.id}>
                <td data-label="Order ID" className={styles.orderId}>#{o.id}</td>
                <td data-label="Buyer">{o.buyer}</td>
                <td data-label="Item" className={styles.itemName}>{o.item}</td>
                <td data-label="Amount" className={styles.amount}>₹{o.amount.toLocaleString("en-IN")}</td>
                <td data-label="Status">
                  <span className={`${styles.statusPill} ${getStatusClass(o.status)}`}>
                    {o.status}
                  </span>
                </td>
                <td data-label="Date" className={styles.date}>{o.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}