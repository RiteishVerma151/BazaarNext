import { useState } from "react";
import Navbar from "../../components/commoncomponents/Navbar.jsx";
import Footer from "../../components/commoncomponents/Footer.jsx";
import OrderCard from "../../components/myOrders/OrderCard.jsx";
import OrderTabs from "../../components/myOrders/OrderTabs.jsx";
import styles from "../../styles/myOrders/MyOrdersPage.module.css";

// Mock Data (Baad me API se replace kar dena)
const MOCK_ORDERS = [
  {
    id: "ORD-1024",
    date: "Oct 18, 2026",
    status: "Delivered",
    total: 1250,
    items: [
      { name: "Premium leather backpack", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=400&q=80", price: 1250 }
    ]
  },
  {
    id: "ORD-1023",
    date: "Oct 15, 2026",
    status: "Out for Delivery",
    total: 900,
    items: [
      { name: "Table fan", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=80", price: 900 }
    ]
  },
  {
    id: "ORD-1022",
    date: "Oct 10, 2026",
    status: "Processing",
    total: 2800,
    items: [
      { name: "Hero cycle", image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=400&q=80", price: 2800 }
    ]
  },
  {
    id: "ORD-1021",
    date: "Sep 28, 2026",
    status: "Cancelled",
    total: 450,
    items: [
      { name: "School backpack", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=400&q=80", price: 450 }
    ]
  }
];

export default function MyOrdersPage() {
  const [activeTab, setActiveTab] = useState("All");

  // Filter logic based on active tab
  const filteredOrders = MOCK_ORDERS.filter((order) => {
    if (activeTab === "All") return true;
    if (activeTab === "Active") return ["Processing", "Out for Delivery"].includes(order.status);
    return order.status === activeTab;
  });

  return (
    <>
      <Navbar />
      <main className={styles.page}>
        <div className={styles.container}>
          
          <div className={styles.header}>
            <h1>My Orders</h1>
            <p>Track, return, or buy things again</p>
          </div>

          <OrderTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          <div className={styles.ordersList}>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))
            ) : (
              <div className={styles.emptyState}>
                <h2>No orders found</h2>
                <p>You don't have any {activeTab.toLowerCase()} orders yet.</p>
              </div>
            )}
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}