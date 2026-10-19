import styles from "../../styles/myOrders/OrderTabs.module.css";

const TABS = ["All", "Active", "Delivered", "Cancelled"];

export default function OrderTabs({ activeTab, setActiveTab }) {
  return (
    <div className={styles.tabsWrap}>
      {TABS.map((tab) => (
        <button
          key={tab}
          className={`${styles.tabBtn} ${activeTab === tab ? styles.active : ""}`}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}