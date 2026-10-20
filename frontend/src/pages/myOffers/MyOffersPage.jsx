import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/axios.js";
import Navbar from "../../components/commoncomponents/Navbar.jsx";
import Footer from "../../components/commoncomponents/Footer.jsx";

const money = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

const statusColor = {
  PENDING: "#b7791f",
  ACCEPTED: "#15803d",
  REJECTED: "#dc2626",
  CANCELLED: "#64748b",
};

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const getId = (value) => {
  if (!value) return "";

  if (typeof value === "object") {
    return String(value._id || value.id || "");
  }

  return String(value);
};

const getOrdersArray = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.orders)) return data.orders;
  if (Array.isArray(data?.data?.orders)) return data.data.orders;
  return [];
};

const styles = {
  page: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "36px 20px 60px",
    minHeight: "60vh",
    color: "var(--text-primary, #172033)",
  },
  heading: { fontSize: 30, margin: "0 0 8px" },
  subtitle: { color: "#64748b", marginBottom: 28 },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 310px), 1fr))",
    gap: 18,
  },
  card: {
    border: "1px solid #e2e8f0",
    borderRadius: 14,
    padding: 20,
    background: "var(--card-bg, #fff)",
    boxShadow: "0 3px 12px rgba(15, 23, 42, 0.04)",
  },
  button: {
    padding: "10px 15px",
    border: 0,
    borderRadius: 8,
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
  },
};

export default function MyOffersPage() {
  const [offers, setOffers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const fetchOffers = useCallback(async () => {
    try {
      setError("");

      const [offersResponse, ordersResponse] = await Promise.all([
        api.get("/negotiations/my"),
        api.get("/orders/my-orders"),
      ]);

      setOffers(offersResponse.data?.offers ?? []);
      setOrders(getOrdersArray(ordersResponse.data));
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load offers and order payment status."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  // Find the order linked to this offer.
  const getOfferOrder = (offerId, orderList = orders) => {
    return orderList.find(
      (order) =>
        getId(order.negotiation) === String(offerId)
    );
  };

  const isOrderPaid = (order) => {
    return (
      order?.status === "paid" ||
      order?.status === "completed"
    );
  };

  const cancelOffer = async (offerId) => {
    if (!window.confirm("Do you want to cancel this offer?")) return;

    try {
      setBusyId(offerId);
      setError("");
      setNotice("");

      const response = await api.patch(
        `/negotiations/${offerId}/cancel`
      );

      setNotice(
        response.data.message || "Offer cancelled successfully."
      );

      await fetchOffers();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to cancel this offer."
      );
    } finally {
      setBusyId("");
    }
  };

  const payForOffer = async (offer) => {
    if (busyId || offer.status !== "ACCEPTED") return;

    try {
      setBusyId(offer._id);
      setError("");
      setNotice("");

      // Refresh the order list before opening checkout.
      const ordersResponse = await api.get("/orders/my-orders");
      const latestOrders = getOrdersArray(ordersResponse.data);

      setOrders(latestOrders);

      const existingOrder = getOfferOrder(
        offer._id,
        latestOrders
      );

      // Prevent another payment if this offer is already paid.
      if (isOrderPaid(existingOrder)) {
        setNotice("This offer has already been paid successfully.");
        return;
      }

      let order = existingOrder;

      // Create an order only if no linked order exists.
      if (!order) {
        const orderResponse = await api.post("/orders", {
          negotiationId: offer._id,
        });

        order =
          orderResponse.data?.order ||
          orderResponse.data?.data?.order;

        if (!orderResponse.data?.success || !order?._id) {
          throw new Error(
            orderResponse.data?.message ||
              "Unable to create order for this offer."
          );
        }
      }

      if (isOrderPaid(order)) {
        setNotice("This offer has already been paid successfully.");
        return;
      }

      if (order.status !== "pending") {
        throw new Error(
          "This order is not currently available for payment."
        );
      }

      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        throw new Error(
          "Unable to load Razorpay. Check your internet connection."
        );
      }

      const paymentResponse = await api.post(
        "/payments/create-order",
        { orderId: order._id }
      );

      const paymentData = paymentResponse.data;
      const payment = paymentData?.payment;

      if (
        !paymentData?.success ||
        !payment?.razorpayOrderId ||
        !paymentData?.keyId
      ) {
        throw new Error(
          paymentData?.message || "Unable to start payment."
        );
      }

      const razorpay = new window.Razorpay({
        key: paymentData.keyId,
        amount: payment.amount,
        currency: payment.currency || "INR",
        name: "BazaarNext",
        description: offer.product?.title || "Accepted offer",
        order_id: payment.razorpayOrderId,

        handler: async (razorpayResponse) => {
          try {
            const verificationResponse = await api.post(
              "/payments/verify",
              {
                razorpayOrderId:
                  razorpayResponse.razorpay_order_id,
                razorpayPaymentId:
                  razorpayResponse.razorpay_payment_id,
                razorpaySignature:
                  razorpayResponse.razorpay_signature,
              }
            );

            if (!verificationResponse.data?.success) {
              throw new Error(
                verificationResponse.data?.message ||
                  "Payment verification failed."
              );
            }

            setNotice("Payment successful! Your order is updated.");

            // Reload offers AND orders to remove the Pay button.
            await fetchOffers();
          } catch (err) {
            setError(
              err.response?.data?.message ||
                err.message ||
                "Unable to verify payment. Check My Orders for the latest status."
            );

            await fetchOffers();
          } finally {
            setBusyId("");
          }
        },

        modal: {
          ondismiss: () => setBusyId(""),
        },

        theme: { color: "#0f766e" },
      });

      razorpay.on("payment.failed", (event) => {
        setError(
          event.error?.description ||
            "Payment failed. Please try again."
        );
        setBusyId("");
      });

      razorpay.open();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to start payment for this offer."
      );
      setBusyId("");
    }
  };

  return (
    <>
      <Navbar />

      <main style={styles.page}>
        <h1 style={styles.heading}>My Offers</h1>

        <p style={styles.subtitle}>
          Track your offers and check whether sellers have responded.
        </p>

        {notice && (
          <p role="status" style={{ color: "#15803d", marginBottom: 18 }}>
            {notice}
          </p>
        )}

        {error && (
          <p role="alert" style={{ color: "#dc2626", marginBottom: 18 }}>
            {error}
          </p>
        )}

        {loading ? (
          <p>Loading your offers...</p>
        ) : offers.length === 0 ? (
          <section style={styles.card}>
            <h3>You haven't made any offers yet</h3>
            <p style={{ color: "#64748b" }}>
              Browse products and send an offer to a seller.
            </p>
            <Link to="/products">Browse products</Link>
          </section>
        ) : (
          <div style={styles.grid}>
            {offers.map((offer) => {
              const product = offer.product;
              const seller = offer.seller;

              const pending = offer.status === "PENDING";
              const accepted = offer.status === "ACCEPTED";
              const isBusy = busyId === offer._id;

              const order = getOfferOrder(offer._id);
              const paid = isOrderPaid(order);

              return (
                <article key={offer._id} style={styles.card}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 12,
                    }}
                  >
                    <h3 style={{ margin: "0 0 12px", fontSize: 19 }}>
                      {product?.title || "Product unavailable"}
                    </h3>

                    <span
                      style={{
                        color: paid
                          ? "#15803d"
                          : statusColor[offer.status] || "#64748b",
                        fontSize: 12,
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {paid ? "PAID" : offer.status}
                    </span>
                  </div>

                  <p style={{ margin: "8px 0" }}>
                    Listed price: <strong>{money(product?.price)}</strong>
                  </p>

                  <p style={{ margin: "8px 0" }}>
                    Your offer:{" "}
                    <strong style={{ fontSize: 21, color: "#0f766e" }}>
                      {money(offer.offerPrice)}
                    </strong>
                  </p>

                  {accepted && !paid && (
                    <p style={{ color: "#15803d", fontWeight: 600 }}>
                      Offer accepted! Pay the agreed price below.
                    </p>
                  )}

                  {paid && (
                    <p style={{ color: "#15803d", fontWeight: 600 }}>
                      ✓ Payment completed successfully.
                    </p>
                  )}

                  <p style={{ margin: "8px 0", color: "#64748b" }}>
                    Seller: {seller?.name || seller?.username || "Seller"}
                  </p>

                  {offer.message && (
                    <p style={{ color: "#64748b", overflowWrap: "anywhere" }}>
                      Your message: {offer.message}
                    </p>
                  )}

                  <p style={{ color: "#94a3b8", fontSize: 12 }}>
                    Sent:{" "}
                    {offer.createdAt
                      ? new Date(offer.createdAt).toLocaleString("en-IN")
                      : "Date unavailable"}
                  </p>

                  {pending && (
                    <button
                      type="button"
                      disabled={Boolean(busyId)}
                      onClick={() => cancelOffer(offer._id)}
                      style={{
                        ...styles.button,
                        background: "#64748b",
                        marginTop: 10,
                        opacity: busyId ? 0.6 : 1,
                      }}
                    >
                      {isBusy ? "Cancelling..." : "Cancel Offer"}
                    </button>
                  )}

                  {accepted && !paid && (
                    <button
                      type="button"
                      disabled={Boolean(busyId)}
                      onClick={() => payForOffer(offer)}
                      style={{
                        ...styles.button,
                        display: "block",
                        width: "100%",
                        background: "#0f766e",
                        marginTop: 14,
                        opacity: busyId ? 0.6 : 1,
                      }}
                    >
                      {isBusy
                        ? "Opening payment..."
                        : `Pay ${money(offer.offerPrice)}`}
                    </button>
                  )}

                  {offer.status === "REJECTED" && (
                    <p style={{ color: "#dc2626" }}>
                      This offer was rejected.
                    </p>
                  )}

                  {product?._id && product.status === "AVAILABLE" && (
                    <p style={{ marginBottom: 0, marginTop: 18 }}>
                      <Link to={`/product/${product._id}`}>
                        View product
                      </Link>
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}