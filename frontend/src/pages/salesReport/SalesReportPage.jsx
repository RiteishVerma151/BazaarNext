import { useState } from "react";
import Navbar from "../../components/commoncomponents/Navbar.jsx";
import Footer from "../../components/commoncomponents/Footer.jsx";
import KPICard from "../../components/salesReport/KPICard.jsx";
import WeeklySales from "../../components/salesReport/WeeklySales.jsx";
import TopProducts from "../../components/salesReport/TopProducts.jsx";
import CustomerReviews from "../../components/salesReport/CustomerReviews.jsx";
import RecentOrders from "../../components/salesReport/RecentOrders.jsx";
import styles from "../../styles/salesReport/SalesReportPage.module.css";

const STATS = {
  revenue: 24500,
  orders: 18,
  avgOrderValue: 1361,
  views: 1240,
  revenueChange: 12.5,
  ordersChange: 8.2,
  viewsChange: -3.1,
};

// 👇 KPI data array — map yahan hoga
const KPIS = [
  {
    id: "revenue",
    label: "Total Revenue",
    value: `₹${STATS.revenue.toLocaleString("en-IN")}`,
    change: STATS.revenueChange,
    color: "success",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    id: "orders",
    label: "Orders",
    value: STATS.orders,
    change: STATS.ordersChange,
    color: "info",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
  {
    id: "avg",
    label: "Avg Order Value",
    value: `₹${STATS.avgOrderValue.toLocaleString("en-IN")}`,
    hint: "Per completed order",
    color: "warning",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    id: "views",
    label: "Total Views",
    value: STATS.views.toLocaleString("en-IN"),
    change: STATS.viewsChange,
    color: "purple",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
];

const RANGES = ["7 Days", "30 Days", "90 Days", "All Time"];

export default function SalesReportPage() {
  const [range, setRange] = useState("7 Days");

  const handleExport = () => {
    alert("CSV export started (API pending)");
  };

  return (
    <>
      <Navbar />
      <main className={styles.page}>
        <div className={styles.container}>

          {/* Header */}
          <div className={styles.header}>
            <div>
              <h1>Sales Report</h1>
              <p>Track your earnings, orders, and performance</p>
            </div>
            <div className={styles.headerActions}>
              <div className={styles.rangePills}>
                {RANGES.map((r) => (
                  <button
                    key={r}
                    className={`${styles.rangeBtn} ${range === r ? styles.rangeActive : ""}`}
                    onClick={() => setRange(r)}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <button className={styles.exportBtn} onClick={handleExport}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Export CSV
              </button>
            </div>
          </div>

          
          <div className={styles.kpiGrid}>
            {KPIS.map((kpi) => (
              <KPICard key={kpi.id} {...kpi} />
            ))}
          </div>

          {/* Two column layout */}
          <div className={styles.midLayout}>
            <WeeklySales />
            <TopProducts />
          </div>

          {/* Extracted components */}
          <CustomerReviews />
          <RecentOrders />

        </div>
      </main>
      <Footer />
    </>
  );
}