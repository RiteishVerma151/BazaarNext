import styles from "../../styles/salesReport/WeeklySales.module.css";

const WEEKLY_SALES = [
  { day: "Mon", amount: 1200 },
  { day: "Tue", amount: 2800 },
  { day: "Wed", amount: 1500 },
  { day: "Thu", amount: 3200 },
  { day: "Fri", amount: 4100 },
  { day: "Sat", amount: 5600 },
  { day: "Sun", amount: 3200 },
];

export default function WeeklySales() {
  const maxSale = Math.max(...WEEKLY_SALES.map((d) => d.amount));
  const total = WEEKLY_SALES.reduce((s, d) => s + d.amount, 0);

  return (
    <div className={styles.chartCard}>
      <div className={styles.cardHeader}>
        <div>
          <h2>Weekly Sales</h2>
          <p>Last 7 days revenue</p>
        </div>
        <span className={styles.chartTotal}>
          ₹{total.toLocaleString("en-IN")}
        </span>
      </div>

      {/* 👇 Scroll wrapper — yahi naya hai */}
      <div className={styles.chartScroll}>
        <div className={styles.chart}>
          {WEEKLY_SALES.map((d) => (
            <div key={d.day} className={styles.chartCol}>
              <div className={styles.chartBarWrap}>
                <div
                  className={styles.chartBar}
                  style={{ height: `${(d.amount / maxSale) * 100}%` }}
                  title={`₹${d.amount.toLocaleString("en-IN")}`}
                >
                  <span className={styles.chartValue}>₹{d.amount / 1000}k</span>
                </div>
              </div>
              <span className={styles.chartDay}>{d.day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}