
import { useCallback, useEffect, useState } from "react";
import Navbar from "../../components/commoncomponents/Navbar.jsx";
import Footer from "../../components/commoncomponents/Footer.jsx";
import api from "../../lib/axios.js";
import styles from "../seller/SellerDashboard.module.css";

const money = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

const getImageUrl = (image) => {
  if (!image) return "";
  if (/^https?:\/\//i.test(image)) return image;

  const baseURL = api.defaults.baseURL || "http://localhost:3001/api";
  const serverURL = baseURL.replace(/\/api\/?$/, "");

  return `${serverURL}/${image.replace(/^\/+/, "")}`;
};

const titleCase = (value = "") =>
  value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

function Stars({ rating = 0 }) {
  return (
    <span className={styles.stars} aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= Math.round(rating) ? styles.starFilled : ""}>
          ★
        </span>
      ))}
    </span>
  );
}

function RevenueChart({ data = [], monthly = false }) {
  const maxRevenue = Math.max(1, ...data.map((item) => item.revenue || 0));

  return (
    <div className={styles.chart}>
      {data.length === 0 ? (
        <p className={styles.muted}>No sales data for this period.</p>
      ) : (
        data.map((item) => {
          const height = Math.max(
            item.revenue > 0 ? 5 : 0,
            (item.revenue / maxRevenue) * 100
          );

          return (
            <div className={styles.chartColumn} key={item.date}>
              <div className={styles.barArea}>
                <span className={styles.barValue}>
                  {item.revenue > 0 ? money(item.revenue) : ""}
                </span>
                <div
                  className={styles.bar}
                  style={{ height: `${height}%` }}
                  title={`${item.date}: ${money(item.revenue)}`}
                />
              </div>
              <span className={styles.chartLabel}>
                {monthly
                  ? item.date.slice(5)
                  : new Date(`${item.date}T00:00:00`).toLocaleDateString(
                      "en-IN",
                      { day: "numeric", month: "short" }
                    )}
              </span>
            </div>
          );
        })
      )}
    </div>
  );
}

export default function SellerDashboard() {
  const [range, setRange] = useState("30d");
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [shippingId, setShippingId] = useState("");
  const [actionError, setActionError] = useState("");
  const [activeOrderFilter, setActiveOrderFilter] = useState("all");

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/seller-dashboard", {
        params: { range },
      });

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Unable to load seller dashboard."
        );
      }

      setDashboard(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load seller dashboard."
      );
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const markAsShipped = async (orderId) => {
    if (!orderId || shippingId) return;

    const confirmed = window.confirm(
      "Confirm that you have shipped this order?"
    );

    if (!confirmed) return;

    setShippingId(orderId);
    setActionError("");

    try {
      const response = await api.patch(`/orders/${orderId}/ship`);

      if (response.data?.success === false) {
        throw new Error(response.data.message || "Could not update order.");
      }

      await fetchDashboard();
    } catch (err) {
      setActionError(
        err.response?.data?.message ||
          err.message ||
          "Unable to mark order as shipped."
      );
    } finally {
      setShippingId("");
    }
  };

  const summary = dashboard?.summary || {};
  const analytics = dashboard?.analytics || {};
  const orders = dashboard?.orders || [];
  const reviews = dashboard?.reviews || [];
  const chart = analytics.chart || [];

  const filteredOrders = orders.filter((order) => {
    if (activeOrderFilter === "all") return true;
    return order.status === activeOrderFilter;
  });

  return (
    <>
      <Navbar />

      <main className={styles.page}>
        <div className={styles.container}>
          <header className={styles.header}>
            <div>
              <p className={styles.eyebrow}>SELLER CENTRE</p>
              <h1>Sales Dashboard</h1>
              <p className={styles.subtitle}>
                Track your revenue, manage orders and understand your customers.
              </p>
            </div>

            <button
              className={styles.refreshButton}
              onClick={fetchDashboard}
              disabled={loading}
            >
              {loading ? "Refreshing..." : "↻ Refresh"}
            </button>
          </header>

          {error && (
            <div className={styles.errorBox}>
              <p>{error}</p>
              <button onClick={fetchDashboard}>Try again</button>
            </div>
          )}

          {loading && !dashboard ? (
            <div className={styles.emptyState}>Loading your sales data...</div>
          ) : dashboard ? (
            <>
              <section className={styles.statsGrid}>
                <article className={styles.statCard}>
                  <span className={styles.statIcon}>₹</span>
                  <p>Total Revenue</p>
                  <h2>{money(summary.revenue)}</h2>
                  <span className={styles.statHint}>
                    From paid, shipped and delivered orders
                  </span>
                </article>

                <article className={styles.statCard}>
                  <span className={styles.statIcon}>▤</span>
                  <p>Total Orders</p>
                  <h2>{summary.totalOrders || 0}</h2>
                  <span className={styles.statHint}>All order statuses</span>
                </article>

                <article className={styles.statCard}>
                  <span className={styles.statIcon}>◷</span>
                  <p>Awaiting Shipment</p>
                  <h2>{summary.paidOrders || 0}</h2>
                  <span className={styles.statHint}>Paid orders to process</span>
                </article>

                <article className={styles.statCard}>
                  <span className={styles.statIcon}>✓</span>
                  <p>Delivered</p>
                  <h2>{summary.completedOrders || 0}</h2>
                  <span className={styles.statHint}>Completed orders</span>
                </article>
              </section>

              <section className={styles.panel}>
                <div className={styles.panelHeader}>
                  <div>
                    <h2>Revenue Analytics</h2>
                    <p className={styles.muted}>
                      Revenue and order activity by date
                    </p>
                  </div>

                  <select
                    className={styles.rangeSelect}
                    value={range}
                    onChange={(event) => setRange(event.target.value)}
                    aria-label="Revenue date range"
                  >
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="3m">Last 3 months</option>
                    <option value="6m">Last 6 months</option>
                    <option value="1y">Last year</option>
                  </select>
                </div>

                <div className={styles.analyticsTotals}>
                  <div>
                    <span>Revenue in selected period</span>
                    <strong>{money(analytics.rangeRevenue)}</strong>
                  </div>
                  <div>
                    <span>Orders in selected period</span>
                    <strong>{analytics.rangeOrders || 0}</strong>
                  </div>
                </div>

                <RevenueChart
                  data={chart}
                  monthly={["3m", "6m", "1y"].includes(range)}
                />
                <p className={styles.chartNote}>
                  Revenue includes paid, shipped and delivered orders. Dates
                  currently use the order creation date.
                </p>
              </section>

              <section className={styles.panel}>
                <div className={styles.panelHeader}>
                  <div>
                    <h2>Order Management</h2>
                    <p className={styles.muted}>
                      Review purchases and update shipping status
                    </p>
                  </div>

                  <select
                    className={styles.rangeSelect}
                    value={activeOrderFilter}
                    onChange={(event) => setActiveOrderFilter(event.target.value)}
                    aria-label="Filter orders"
                  >
                    <option value="all">All orders</option>
                    <option value="pending">Pending payment</option>
                    <option value="paid">Paid</option>
                    <option value="shipped">Shipped</option>
                    <option value="completed">Delivered</option>
                  </select>
                </div>

                {actionError && (
                  <p className={styles.errorText} role="alert">
                    {actionError}
                  </p>
                )}

                {filteredOrders.length === 0 ? (
                  <div className={styles.emptyState}>
                    No orders found for this filter.
                  </div>
                ) : (
                  <div className={styles.tableWrap}>
                    <table className={styles.ordersTable}>
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Buyer</th>
                          <th>Order Date</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>

                      <tbody>
                        {filteredOrders.map((order) => {
                          const product =
                            order.product && typeof order.product === "object"
                              ? order.product
                              : null;

                          const buyer =
                            order.buyer && typeof order.buyer === "object"
                              ? order.buyer
                              : null;

                          const image = product?.images?.[0];

                          return (
                            <tr key={order._id}>
                              <td>
                                <div className={styles.productCell}>
                                  {image ? (
                                    <img
                                      src={getImageUrl(image)}
                                      alt=""
                                    />
                                  ) : (
                                    <div className={styles.imagePlaceholder}>
                                      —
                                    </div>
                                  )}
                                  <span>
                                    {product?.title || "Product unavailable"}
                                  </span>
                                </div>
                              </td>
                              <td>
                                <div>{buyer?.name || "Buyer"}</div>
                                <small>{buyer?.email || ""}</small>
                              </td>
                              <td>{formatDate(order.createdAt)}</td>
                              <td className={styles.amount}>
                                {money(order.price)}
                              </td>
                              <td>
                                <span
                                  className={`${styles.status} ${styles[`status_${order.status}`] || ""}`}
                                >
                                  {titleCase(order.status)}
                                </span>
                              </td>
                              <td>
                                {order.status === "paid" ? (
                                  <button
                                    className={styles.shipButton}
                                    onClick={() => markAsShipped(order._id)}
                                    disabled={Boolean(shippingId)}
                                  >
                                    {shippingId === order._id
                                      ? "Updating..."
                                      : "Mark as Shipped"}
                                  </button>
                                ) : order.status === "shipped" ? (
                                  <span className={styles.muted}>
                                    Awaiting buyer
                                  </span>
                                ) : order.status === "completed" ? (
                                  <span className={styles.deliveredText}>
                                    ✓ Delivered
                                  </span>
                                ) : (
                                  <span className={styles.muted}>
                                    Awaiting payment
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                <p className={styles.chartNote}>
                  Showing up to 50 most recent orders.
                </p>
              </section>

              <section className={styles.panel}>
                <div className={styles.panelHeader}>
                  <div>
                    <h2>Customer Ratings & Reviews</h2>
                    <p className={styles.muted}>
                      Feedback from customers who reviewed you
                    </p>
                  </div>
                </div>

                <div className={styles.ratingSummary}>
                  <div className={styles.ratingScore}>
                    <strong>
                      {Number(summary.averageRating || 0).toFixed(1)}
                    </strong>
                    <Stars rating={summary.averageRating || 0} />
                    <span>{summary.totalReviews || 0} reviews</span>
                  </div>

                  <div className={styles.ratingDescription}>
                    <h3>Your seller reputation</h3>
                    <p>
                      Ratings are based on reviews submitted after an order is
                      completed.
                    </p>
                  </div>
                </div>

                {reviews.length === 0 ? (
                  <div className={styles.emptyState}>
                    No customer reviews yet. Reviews will appear here when
                    customers rate completed orders.
                  </div>
                ) : (
                  <div className={styles.reviewsList}>
                    {reviews.map((review) => (
                      <article className={styles.reviewCard} key={review._id}>
                        <div className={styles.reviewTop}>
                          <div>
                            <h3>{review.reviewer?.name || "Customer"}</h3>
                            <Stars rating={review.rating} />
                          </div>
                          <span className={styles.muted}>
                            {formatDate(review.createdAt)}
                          </span>
                        </div>

                        {review.order?.product?.title && (
                          <p className={styles.reviewProduct}>
                            Product: {review.order.product.title}
                          </p>
                        )}

                        <p className={styles.reviewComment}>
                          {review.comment || "No written comment."}
                        </p>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            </>
          ) : null}
        </div>
      </main>

      <Footer />
    </>
  );
}
