
import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/axios.js";
import styles from "../../styles/myOrders/OrderCard.module.css";

const formatPrice = (price) =>
  Number(price || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });

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

const getImageUrl = (image) => {
  if (!image) return "";
  if (/^https?:\/\//i.test(image)) return image;

  const baseURL =
    api.defaults.baseURL || "https://bazaarnext.onrender.com/api";
  const serverURL = baseURL.replace(/\/api\/?$/, "");

  return `${serverURL}/${image.replace(/^\/+/, "")}`;
};

export default function OrderCard({ order, onPaymentSuccess }) {
  const [paying, setPaying] = useState(false);
  const [confirmingDelivery, setConfirmingDelivery] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [deliveryError, setDeliveryError] = useState("");

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");

  const product =
    order.product && typeof order.product === "object"
      ? order.product
      : {};

  const orderId = order._id || order.id;
  const productId = product.id || product._id;

  const image = Array.isArray(product.images)
    ? product.images[0]
    : product.image || "";

  const rawStatus = String(order.status || "pending").toLowerCase();

  const statusMap = {
    pending: "Pending Payment",
    paid: "Paid",
    shipped: "Shipped",
    completed: "Delivered",
    cancelled: "Cancelled",
  };

  const status = statusMap[rawStatus] || rawStatus;

  const getStatusClass = () => {
    if (rawStatus === "completed") return styles.statusDelivered;
    if (rawStatus === "pending") return styles.statusProcessing;

    if (rawStatus === "paid" || rawStatus === "shipped") {
      return styles.statusOutForDelivery || styles.statusProcessing;
    }

    if (rawStatus === "cancelled") return styles.statusCancelled;

    return "";
  };

  const date = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Date unavailable";

  const handlePayNow = async () => {
    if (!orderId || paying) return;

    setPaying(true);
    setPaymentError("");

    try {
      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        throw new Error(
          "Unable to load Razorpay. Check your internet connection."
        );
      }

      const response = await api.post("/payments/create-order", {
        orderId,
      });

      const data = response.data;
      const payment = data?.payment;

      if (!data?.success || !payment?.razorpayOrderId || !data?.keyId) {
        throw new Error(data?.message || "Unable to start payment.");
      }

      const options = {
        key: data.keyId,
        amount: payment.amount,
        currency: payment.currency || "INR",
        name: "BazaarNext",
        description: product.title || "Marketplace purchase",
        order_id: payment.razorpayOrderId,

        handler: async (razorpayResponse) => {
          try {
            const verification = await api.post("/payments/verify", {
              razorpayOrderId: razorpayResponse.razorpay_order_id,
              razorpayPaymentId: razorpayResponse.razorpay_payment_id,
              razorpaySignature: razorpayResponse.razorpay_signature,
            });

            if (!verification.data?.success) {
              throw new Error(
                verification.data?.message ||
                  "Payment verification failed."
              );
            }

            window.alert("Payment successful! Your order has been updated.");
            await onPaymentSuccess?.();
          } catch (error) {
            setPaymentError(
              error.response?.data?.message ||
                error.message ||
                "Payment verification failed. If money was deducted, contact support."
            );
          } finally {
            setPaying(false);
          }
        },

        modal: {
          ondismiss: () => setPaying(false),
        },

        theme: {
          color: "#6af0ff",
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", (event) => {
        setPaymentError(
          event.error?.description || "Payment failed. Please try again."
        );
        setPaying(false);
      });

      razorpay.open();
    } catch (error) {
      setPaymentError(
        error.response?.data?.message ||
          error.message ||
          "Unable to start payment."
      );
      setPaying(false);
    }
  };

  const handleConfirmDelivery = async () => {
    if (!orderId || confirmingDelivery) return;

    const confirmed = window.confirm(
      "Have you received this product? Confirming will mark the order as delivered."
    );

    if (!confirmed) return;

    setConfirmingDelivery(true);
    setDeliveryError("");

    try {
      const response = await api.patch(`/orders/${orderId}/complete`);

      if (response.data?.success === false) {
        throw new Error(
          response.data.message || "Unable to confirm delivery."
        );
      }

      window.alert("Delivery confirmed! Your order is now completed.");
      await onPaymentSuccess?.();
    } catch (error) {
      setDeliveryError(
        error.response?.data?.message ||
          error.message ||
          "Unable to confirm delivery. Please try again."
      );
    } finally {
      setConfirmingDelivery(false);
    }
  };

  const handleSubmitReview = async (event) => {
    event.preventDefault();

    if (!orderId || submittingReview) return;

    setSubmittingReview(true);
    setReviewError("");
    setReviewSuccess("");

    try {
      // Uses the existing reviews API.
      const response = await api.post("/reviews", {
        orderId,
        rating,
        comment: comment.trim(),
      });

      if (response.data?.success === false) {
        throw new Error(
          response.data.message || "Unable to submit your review."
        );
      }

      setReviewSuccess("Your review has been submitted successfully!");
      setShowReviewForm(false);
      setComment("");

      await onPaymentSuccess?.();
    } catch (error) {
      setReviewError(
        error.response?.data?.message ||
          error.message ||
          "Unable to submit your review. Please try again."
      );
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className={styles.orderCard}>
      <div className={styles.cardHeader}>
        <div className={styles.orderInfo}>
          <span className={styles.orderId}>
            Order #{String(orderId || "").slice(-8).toUpperCase()}
          </span>
          <span className={styles.orderDate}>Placed on {date}</span>
        </div>

        <div className={`${styles.statusBadge} ${getStatusClass()}`}>
          {status}
        </div>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.productRow}>
          {image ? (
            <img
              src={getImageUrl(image)}
              alt={product.title || "Product"}
              className={styles.productImg}
            />
          ) : (
            <div className={styles.productImg}>No image</div>
          )}

          <div className={styles.productDetails}>
            <h3>{product.title || "Product unavailable"}</h3>
            <p className={styles.price}>
              ₹{formatPrice(order.price ?? product.price)}
            </p>
          </div>
        </div>
      </div>

      <div className={styles.cardFooter}>
        <div className={styles.totalAmount}>
          <span>Total Amount:</span>
          <strong>₹{formatPrice(order.price ?? product.price)}</strong>
        </div>

        <div className={styles.actions}>
          {productId && (
            <Link
              to={`/product/${productId}`}
              className={styles.viewDetailsBtn}
            >
              View Item
            </Link>
          )}

          {rawStatus === "pending" && (
            <button
              type="button"
              className={styles.buyAgainBtn}
              onClick={handlePayNow}
              disabled={paying}
            >
              {paying ? "Processing..." : "Pay Now"}
            </button>
          )}

          {rawStatus === "shipped" && (
            <button
              type="button"
              className={styles.buyAgainBtn}
              onClick={handleConfirmDelivery}
              disabled={confirmingDelivery}
            >
              {confirmingDelivery
                ? "Confirming..."
                : "Confirm Delivery"}
            </button>
          )}

          {rawStatus === "completed" && (
            <button
              type="button"
              className={styles.buyAgainBtn}
              onClick={() => {
                setShowReviewForm((previous) => !previous);
                setReviewError("");
                setReviewSuccess("");
              }}
            >
              ★ Rate &amp; Review Seller
            </button>
          )}
        </div>
      </div>

      {paymentError && (
        <p role="alert" style={{ color: "#e05252", marginTop: "12px" }}>
          {paymentError}
        </p>
      )}

      {deliveryError && (
        <p role="alert" style={{ color: "#e05252", marginTop: "12px" }}>
          {deliveryError}
        </p>
      )}

      {reviewSuccess && (
        <p role="status" style={{ color: "#6af0a0", marginTop: "12px" }}>
          {reviewSuccess}
        </p>
      )}

      {rawStatus === "completed" && showReviewForm && (
        <form
          onSubmit={handleSubmitReview}
          style={{
            marginTop: "20px",
            padding: "20px",
            border: "1px solid rgba(106, 240, 255, 0.25)",
            borderRadius: "12px",
            background: "rgba(106, 240, 255, 0.04)",
          }}
        >
          <h3 style={{ margin: "0 0 14px" }}>Rate your experience</h3>

          <label
            htmlFor={`rating-${orderId}`}
            style={{ display: "block", marginBottom: "8px" }}
          >
            Your rating
          </label>

          <div
            id={`rating-${orderId}`}
            role="radiogroup"
            aria-label="Seller rating"
            style={{
              display: "flex",
              gap: "8px",
              marginBottom: "18px",
            }}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                role="radio"
                aria-checked={rating === star}
                aria-label={`${star} star${star > 1 ? "s" : ""}`}
                onClick={() => setRating(star)}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: "30px",
                  color: star <= rating ? "#ffc857" : "#64748b",
                  padding: "0 2px",
                }}
              >
                ★
              </button>
            ))}
          </div>

          <label
            htmlFor={`comment-${orderId}`}
            style={{ display: "block", marginBottom: "8px" }}
          >
            Your review (optional)
          </label>

          <textarea
            id={`comment-${orderId}`}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Share your experience with the seller..."
            maxLength={1000}
            rows={4}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid rgba(106, 240, 255, 0.25)",
              background: "#0b202c",
              color: "#ffffff",
              font: "inherit",
              resize: "vertical",
              marginBottom: "12px",
            }}
          />

          <p
            style={{
              textAlign: "right",
              fontSize: "12px",
              opacity: 0.7,
              marginTop: "-6px",
            }}
          >
            {comment.length}/1000
          </p>

          {reviewError && (
            <p role="alert" style={{ color: "#e05252", marginBottom: "12px" }}>
              {reviewError}
            </p>
          )}

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              type="submit"
              className={styles.buyAgainBtn}
              disabled={submittingReview}
            >
              {submittingReview ? "Submitting..." : "Submit Review"}
            </button>

            <button
              type="button"
              className={styles.viewDetailsBtn}
              onClick={() => {
                setShowReviewForm(false);
                setReviewError("");
              }}
              disabled={submittingReview}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
