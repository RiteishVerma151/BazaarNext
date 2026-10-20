import styles from "../../styles/salesReport/KPICard.module.css";

export default function KPICard({ label, value, change, hint, icon, color }) {
  // color = "success" | "info" | "warning" | "purple"
  const colorClass = styles[color] || styles.info;

  return (
    <div className={styles.kpiCard}>
      <div className={`${styles.kpiIcon} ${colorClass}`}>
        {icon}
      </div>
      <div className={styles.kpiInfo}>
        <span className={styles.kpiLabel}>{label}</span>
        <span className={styles.kpiValue}>{value}</span>

        {change !== undefined && change !== null && (
          <span className={`${styles.kpiChange} ${change >= 0 ? styles.positive : styles.negative}`}>
            {change >= 0 ? "▲" : "▼"} {Math.abs(change)}% vs last period
          </span>
        )}

        {hint && <span className={styles.kpiHint}>{hint}</span>}
      </div>
    </div>
  );
}