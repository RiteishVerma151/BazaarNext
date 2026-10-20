
import styles from "../../styles/myOrders/OrderTabs.module.css";

const TABS = ["All", "Active", "Pending", "Paid", "Delivered"];

export default function OrderTabs({ activeTab, setActiveTab }) {
  return (
    <div className={styles.tabsWrap}>
      {TABS.map((tab) => (
        <button
          key={tab}
          type="button"
          className={`${styles.tabBtn} ${
            activeTab === tab ? styles.active : ""
          }`}
          onClick={() => setActiveTab(tab)}
          aria-pressed={activeTab === tab}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
