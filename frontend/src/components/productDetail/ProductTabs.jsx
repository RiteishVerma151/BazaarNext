import { useState } from "react";
import styles from "../../styles/ProductDetail/ProductTabs.module.css";

export default function ProductTabs() {
  const [activeTab, setActiveTab] = useState("description");

  return (
    <div>
      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === "description" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("description")}
        >
          Description
        </button>
        <button 
          className={`${styles.tab} ${activeTab === "details" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("details")}
        >
          Details
        </button>
      </div>

      <div className={styles.tabContent}>
        {activeTab === "description" ? (
          <p>High quality leather backpack, barely used. Perfect for college, office, or daily commute. Features multiple compartments, padded laptop sleeve, and water-resistant material. Selling because I upgraded to a bigger one.</p>
        ) : (
          <ul className={styles.detailsList}>
            <li><strong>Category:</strong> Bags</li>
            <li><strong>Condition:</strong> Like new</li>
            <li><strong>Location:</strong> Ulhasnagar 2</li>
          </ul>
        )}
      </div>
    </div>
  );
}