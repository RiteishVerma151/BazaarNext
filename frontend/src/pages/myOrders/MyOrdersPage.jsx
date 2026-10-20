
import { useCallback, useEffect, useState } from "react";
import Navbar from "../../components/commoncomponents/Navbar.jsx";
import Footer from "../../components/commoncomponents/Footer.jsx";
import OrderCard from "../../components/myOrders/OrderCard.jsx";
import OrderTabs from "../../components/myOrders/OrderTabs.jsx";
import api from "../../lib/axios.js";
import styles from "../../styles/myOrders/MyOrdersPage.module.css";

export default function MyOrdersPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/orders/my-orders");
      const data = response.data;

      if (data?.success === false) {
        throw new Error(data.message || "Failed to load orders.");
      }

      const fetchedOrders = Array.isArray(data)
        ? data
        : Array.isArray(data?.orders)
          ? data.orders
          : Array.isArray(data?.data?.orders)
            ? data.data.orders
            : [];

      setOrders(fetchedOrders);
    } catch (err) {
      console.error("Fetch orders error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load your orders."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = orders.filter((order) => {
    const status = String(order.status || "").toLowerCase();

    if (activeTab === "All") return true;

    if (activeTab === "Active") {
      return ["pending", "paid", "shipped"].includes(status);
    }

    if (activeTab === "Delivered") {
      return status === "completed";
    }

    return status === activeTab.toLowerCase();
  });

  return (
    <>
      <Navbar />

      <main className={styles.page}>
        <div className={styles.container}>
          <header className={styles.header}>
            <h1>My Orders</h1>
            <p>Track your purchases and check your order status.</p>
          </header>

          <OrderTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          {loading ? (
            <div className={styles.emptyState}>
              <h2>Loading your orders...</h2>
              <p>Please wait while we fetch your purchases.</p>
            </div>
          ) : error ? (
            <div className={styles.emptyState}>
              <h2>Couldn't load orders</h2>
              <p>{error}</p>
              <button type="button" onClick={fetchOrders}>
                Try Again
              </button>
            </div>
          ) : filteredOrders.length > 0 ? (
            <div className={styles.ordersList}>
              {filteredOrders.map((order, index) => (
                <OrderCard
                  key={order._id || order.id || index}
                  order={order}
                  onPaymentSuccess={fetchOrders}
                />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <h2>
                {orders.length === 0
                  ? "No orders yet"
                  : "No orders found"}
              </h2>

              <p>
                {orders.length === 0
                  ? "Products you order will appear here."
                  : `You don't have any ${activeTab.toLowerCase()} orders.`}
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
