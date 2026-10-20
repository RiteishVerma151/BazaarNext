import { useState } from "react";
import styles from "../../styles/ProductDetail/ProductTabs.module.css";

export default function ProductTabs({
  description = "",
  category = "Other",
  condition = "Used",
  location = "Location not specified",
}) {
  const [activeTab, setActiveTab] = useState("description");

  return (
    <div>
      <div className={styles.tabs}>
        <button
          type="button"
          className={`${styles.tab} ${
            activeTab === "description" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("description")}
        >
          Description
        </button>

        <button
          type="button"
          className={`${styles.tab} ${
            activeTab === "details" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("details")}
        >
          Details
        </button>
      </div>

      <div className={styles.tabContent}>
        {activeTab === "description" ? (
          <p>
            {description || "No description has been provided for this product."}
          </p>
        ) : (
          <ul className={styles.detailsList}>
            <li>
              <strong>Category:</strong> {category}
            </li>
            <li>
              <strong>Condition:</strong> {condition}
            </li>
            <li>
              <strong>Location:</strong> {location}
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}