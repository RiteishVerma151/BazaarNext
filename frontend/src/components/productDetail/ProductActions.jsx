
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../lib/axios.js";
import styles from "../../styles/productDetail/ProductActions.module.css";

export default function ProductActions({ productId, product }) {
  const navigate = useNavigate();

  const [showOfferForm, setShowOfferForm] = useState(false);
  const [offerPrice, setOfferPrice] = useState("");
  const [message, setMessage] = useState("");
  const [offerLoading, setOfferLoading] = useState(false);
  const [offerError, setOfferError] = useState("");
  const [offerSuccess, setOfferSuccess] = useState("");

  const handleBuyNow = () => {
    if (!product || !productId) {
      alert("Product data missing");
      return;
    }

    navigate(`/checkout/${productId}`);
  };

  const handleOfferSubmit = async (event) => {
    event.preventDefault();
    setOfferError("");
    setOfferSuccess("");

    const amount = Number(offerPrice);

    if (!offerPrice.trim() || !Number.isFinite(amount) || amount < 1) {
      setOfferError("Please enter a valid offer price of at least ₹1.");
      return;
    }

    if (amount >= Number(product.price)) {
      setOfferError("Your offer must be lower than the listed price.");
      return;
    }

    if (message.trim().length > 500) {
      setOfferError("Message must be 500 characters or fewer.");
      return;
    }

    try {
      setOfferLoading(true);

      const response = await api.post(`/negotiations/${productId}`, {
        offerPrice: amount,
        message: message.trim(),
      });

      setOfferSuccess(
        response.data?.message || "Your offer was submitted successfully!"
      );
      setOfferPrice("");
      setMessage("");
      setShowOfferForm(false);
    } catch (error) {
      const status = error.response?.status;

      if (status === 401 || status === 403) {
        setOfferError("Please log in to submit an offer.");
      } else {
        setOfferError(
          error.response?.data?.message ||
            "Unable to submit your offer. Please try again."
        );
      }
    } finally {
      setOfferLoading(false);
    }
  };

  return (
    <>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.buyBtn}
          onClick={handleBuyNow}
        >
          Buy Now
        </button>

        <button
          type="button"
          className={styles.offerBtn}
          onClick={() => {
            setOfferError("");
            setOfferSuccess("");
            setShowOfferForm((previous) => !previous);
          }}
        >
          {showOfferForm ? "Cancel Offer" : "Make an Offer"}
        </button>
      </div>

      {showOfferForm && (
        <form
          onSubmit={handleOfferSubmit}
          style={{
            marginTop: 18,
            padding: 18,
            border: "1px solid #dbe2ea",
            borderRadius: 12,
            display: "grid",
            gap: 12,
          }}
        >
          <h3 style={{ margin: 0 }}>Make an Offer</h3>

          <p style={{ margin: 0, color: "#64748b", fontSize: 14 }}>
            Listed price: ₹
            {Number(product.price).toLocaleString("en-IN")}
          </p>

          <label htmlFor="offerPrice">Your offer price (₹)</label>
          <input
            id="offerPrice"
            type="number"
            min="1"
            max={Math.max(1, Number(product.price) - 0.01)}
            step="0.01"
            value={offerPrice}
            onChange={(event) => setOfferPrice(event.target.value)}
            placeholder="Enter your price"
            required
            disabled={offerLoading}
            style={{
              width: "100%",
              padding: 12,
              border: "1px solid #cbd5e1",
              borderRadius: 8,
              boxSizing: "border-box",
            }}
          />

          <label htmlFor="offerMessage">Message (optional)</label>
          <textarea
            id="offerMessage"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Add a message for the seller..."
            maxLength={500}
            rows={3}
            disabled={offerLoading}
            style={{
              width: "100%",
              padding: 12,
              border: "1px solid #cbd5e1",
              borderRadius: 8,
              resize: "vertical",
              boxSizing: "border-box",
            }}
          />

          <p style={{ margin: 0, color: "#64748b", fontSize: 12 }}>
            {message.length}/500 characters
          </p>

          {offerError && (
            <p role="alert" style={{ color: "#dc2626", margin: 0 }}>
              {offerError}{" "}
              {offerError.includes("log in") && (
                <Link to="/login">Log in</Link>
              )}
            </p>
          )}

          <button
            type="submit"
            className={styles.buyBtn}
            disabled={offerLoading}
          >
            {offerLoading ? "Sending Offer..." : "Send Offer"}
          </button>
        </form>
      )}

      {offerSuccess && (
        <p role="status" style={{ color: "#15803d", marginTop: 12 }}>
          {offerSuccess}
        </p>
      )}

      <p className={styles.safetyText}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        Always meet in a public place and inspect the item before paying.
      </p>
    </>
  );
}
