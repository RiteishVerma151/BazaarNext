
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

export default function OffersPage() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const fetchOffers = useCallback(async () => {
    try {
      setError("");
      const response = await api.get("/negotiations/received");
      setOffers(response.data.offers ?? []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load received offers."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  const respond = async (offerId, status) => {
    const action = status === "ACCEPTED" ? "accept" : "reject";

    if (!window.confirm(`Are you sure you want to ${action} this offer?`)) {
      return;
    }

    try {
      setBusyId(offerId);
      setError("");
      setNotice("");

      const response = await api.patch(
        `/negotiations/${offerId}/respond`,
        { status }
      );

      setNotice(response.data.message || `Offer ${action}ed successfully.`);
      await fetchOffers();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update this offer.");
      await fetchOffers();
    } finally {
      setBusyId("");
    }
  };

  return (
    <>
      <Navbar />
      <main style={styles.page}>
        <h1 style={styles.heading}>Received Offers</h1>
        <p style={styles.subtitle}>
          Review offers from buyers and decide whether to accept or reject them.
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
          <p>Loading offers...</p>
        ) : offers.length === 0 ? (
          <section style={styles.card}>
            <h3>No offers yet</h3>
            <p style={{ color: "#64748b" }}>
              When buyers make offers on your products, they will appear here.
            </p>
            <Link to="/my-listings">View My Listings</Link>
          </section>
        ) : (
          <div style={styles.grid}>
            {offers.map((offer) => {
              const product = offer.product;
              const buyer = offer.buyer;
              const pending = offer.status === "PENDING";

              return (
                <article key={offer._id} style={styles.card}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                      alignItems: "flex-start",
                    }}
                  >
                    <h3 style={{ margin: "0 0 12px", fontSize: 19 }}>
                      {product?.title || "Product unavailable"}
                    </h3>
                    <span
                      style={{
                        color: statusColor[offer.status] || "#64748b",
                        fontSize: 12,
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {offer.status}
                    </span>
                  </div>

                  <p style={{ margin: "8px 0" }}>
                    Listed price: <strong>{money(product?.price)}</strong>
                  </p>
                  <p style={{ margin: "8px 0" }}>
                    Buyer offered:{" "}
                    <strong style={{ fontSize: 21, color: "#0f766e" }}>
                      {money(offer.offerPrice)}
                    </strong>
                  </p>
                  <p style={{ margin: "8px 0", color: "#64748b" }}>
                    Buyer: {buyer?.name || buyer?.username || "Buyer"}
                  </p>

                  {offer.message && (
                    <div
                      style={{
                        background: "#f8fafc",
                        borderRadius: 8,
                        padding: 12,
                        marginTop: 14,
                        overflowWrap: "anywhere",
                      }}
                    >
                      <strong>Buyer message</strong>
                      <p style={{ margin: "6px 0 0" }}>{offer.message}</p>
                    </div>
                  )}

                  <p style={{ color: "#94a3b8", fontSize: 12 }}>
                    Received:{" "}
                    {offer.createdAt
                      ? new Date(offer.createdAt).toLocaleString("en-IN")
                      : "Date unavailable"}
                  </p>

                  {pending && (
                    <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
                      <button
                        type="button"
                        disabled={busyId === offer._id}
                        onClick={() => respond(offer._id, "ACCEPTED")}
                        style={{
                          ...styles.button,
                          background: "#15803d",
                          opacity: busyId === offer._id ? 0.6 : 1,
                        }}
                      >
                        {busyId === offer._id ? "Please wait..." : "Accept"}
                      </button>
                      <button
                        type="button"
                        disabled={busyId === offer._id}
                        onClick={() => respond(offer._id, "REJECTED")}
                        style={{
                          ...styles.button,
                          background: "#dc2626",
                          opacity: busyId === offer._id ? 0.6 : 1,
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {product?._id && (
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