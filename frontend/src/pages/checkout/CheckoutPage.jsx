
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/commoncomponents/Navbar.jsx";
import Footer from "../../components/commoncomponents/Footer.jsx";
import api from "../../lib/axios.js";
import styles from "../../styles/checkout/CheckoutPage.module.css";

function loadRazorpayScript() {
  return new Promise((resolve) => {
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
}

export default function CheckoutPage() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const [successOrderId, setSuccessOrderId] = useState("");

  useEffect(() => {
    let active = true;

    async function fetchProduct() {
      try {
        setLoading(true);
        setError("");

        if (!productId) {
          setError("Product ID is missing.");
          return;
        }

        const response = await api.get(`/products/${productId}`);
        const data = response.data?.product;

        // Backend productResponse returns "id", not "_id".
        if (!data?.id) {
          setError(response.data?.message || "Product not found.");
          return;
        }

        if (data.status !== "AVAILABLE") {
          setError("This product is no longer available.");
          return;
        }

        if (active) {
          setProduct({
            ...data,
            _id: data.id,
          });
        }
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message ||
              "Unable to load this product."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchProduct();

    return () => {
      active = false;
    };
  }, [productId]);

  const handlePayment = async () => {
    if (!product?._id || paying) return;

    try {
      setPaying(true);
      setError("");

      // 1. Create a real order in our backend.
      const orderResponse = await api.post("/orders", {
        productId: product._id,
      });

      const order = orderResponse.data?.order;

      if (!order?._id) {
        throw new Error("Order creation failed. Please try again.");
      }

      // 2. Create the Razorpay order.
      const paymentResponse = await api.post("/payments/create-order", {
        orderId: order._id,
      });

      const paymentData = paymentResponse.data?.payment;
      const keyId = paymentResponse.data?.keyId;

      if (!paymentData?.razorpayOrderId || !keyId) {
        throw new Error("Unable to initialize Razorpay payment.");
      }

      // 3. Load Razorpay Checkout.
      const loaded = await loadRazorpayScript();

      if (!loaded) {
        throw new Error(
          "Razorpay Checkout failed to load. Check your internet connection."
        );
      }

      const options = {
        key: keyId,
        amount: paymentData.amount,
        currency: paymentData.currency || "INR",
        name: "BazaarNext",
        description: product.title || "Product purchase",
        order_id: paymentData.razorpayOrderId,

        handler: async (razorpayResponse) => {
          try {
            // 4. Verify the payment on the backend.
            const verifyResponse = await api.post("/payments/verify", {
              razorpayOrderId: razorpayResponse.razorpay_order_id,
              razorpayPaymentId: razorpayResponse.razorpay_payment_id,
              razorpaySignature: razorpayResponse.razorpay_signature,
            });

            if (!verifyResponse.data?.success) {
              throw new Error("Payment verification failed.");
            }

            setSuccessOrderId(order._id);
          } catch (err) {
            setError(
              err.response?.data?.message ||
                err.message ||
                "Payment verification failed. Check My Orders before retrying."
            );
          } finally {
            setPaying(false);
          }
        },

        modal: {
          ondismiss: () => {
            setPaying(false);
          },
        },

        theme: {
          color: "#6af0ff",
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", (response) => {
        setError(
          response.error?.description ||
            "Payment failed. Please try again."
        );
        setPaying(false);
      });

      razorpay.open();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to start checkout."
      );
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className={styles.page}>
          <p>Loading product...</p>
        </main>
        <Footer />
      </>
    );
  }

  if (successOrderId) {
    return (
      <>
        <Navbar />
        <main className={styles.page}>
          <div className={styles.successCard}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>🎉</div>
            <h1>Payment Successful!</h1>
            <p>
              Payment verified successfully. Your order ID is{" "}
              <strong>{successOrderId}</strong>.
            </p>
            <Link to="/my-orders" className={styles.successBtn}>
              View My Orders
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error && !product) {
    return (
      <>
        <Navbar />
        <main className={styles.page}>
          <div className={styles.successCard}>
            <h1>Unable to Open Checkout</h1>
            <p role="alert">{error}</p>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className={styles.successBtn}
            >
              Go Back
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const price = Number(product?.price || 0);

  return (
    <>
      <Navbar />

      <main className={styles.page}>
        <div className={styles.container}>
          <h1 className={styles.title}>Checkout</h1>
          <p className={styles.subtitle}>
            Review your product and complete your payment.
          </p>

          <div className={styles.layout}>
            <div className={styles.mainCol}>
              <section className={styles.section}>
                <h2>Product Details</h2>

                {product.images?.[0] && (
                  <img
                    src={
                      product.images[0].startsWith("http")
                        ? product.images[0]
                        : `${api.defaults.baseURL?.replace(/\/api\/?$/, "") || ""}${product.images[0]}`
                    }
                    alt={product.title}
                    style={{
                      width: "100%",
                      maxWidth: 280,
                      maxHeight: 220,
                      objectFit: "contain",
                      borderRadius: 12,
                    }}
                  />
                )}

                <h3>{product.title}</h3>
                <p>{product.description}</p>

                <p>
                  Price:{" "}
                  <strong>₹{price.toLocaleString("en-IN")}</strong>
                </p>
              </section>
            </div>

            <aside className={styles.summary}>
              <h2>Order Summary</h2>

              <div className={styles.rowLine}>
                <span>{product.title}</span>
                <span>₹{price.toLocaleString("en-IN")}</span>
              </div>

              <div className={styles.divider} />

              <div className={styles.totalRow}>
                <span>Total</span>
                <strong>₹{price.toLocaleString("en-IN")}</strong>
              </div>

              {error && (
                <p role="alert" style={{ color: "#dc2626" }}>
                  {error}
                </p>
              )}

              <button
                type="button"
                className={styles.placeBtn}
                onClick={handlePayment}
                disabled={paying || product.status !== "AVAILABLE"}
              >
                {paying
                  ? "Processing..."
                  : `Pay ₹${price.toLocaleString("en-IN")}`}
              </button>

              <p style={{ fontSize: 13, color: "#64748b" }}>
                Payment is processed securely through Razorpay.
              </p>

              <Link to={`/product/${productId}`}>
                Back to Product
              </Link>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
