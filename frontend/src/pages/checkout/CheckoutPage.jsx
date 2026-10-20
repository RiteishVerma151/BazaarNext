import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/commoncomponents/Navbar.jsx";
import Footer from "../../components/commoncomponents/Footer.jsx";
import { useCart } from "../../context/CartContext";
import styles from "../../styles/checkout/CheckoutPage.module.css";

const PAYMENT_METHODS = [
  { id: "upi", label: "UPI (GPay, PhonePe)" },
  { id: "card", label: "Credit / Debit Card" },
  { id: "cod", label: "Cash on Delivery (+₹25)" },
];

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    line: "",
    city: "",
    pincode: "",
  });
  const [payment, setPayment] = useState("upi");
  const [placed, setPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");

  const deliveryFee = 40;
  const tax = Math.round(cartTotal * 0.05);
  const codFee = payment === "cod" ? 25 : 0;
  const total = cartTotal + deliveryFee + tax + codFee;

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }
    const id = "ORD-" + Math.floor(1000 + Math.random() * 9000);
    setOrderId(id);
    setPlaced(true);
    clearCart();
  };

  if (placed) {
    return (
      <>
        <Navbar />
        <main className={styles.page}>
          <div className={styles.successCard}>
            <div style={{ fontSize: "60px", marginBottom: "16px" }}>🎉</div>
            <h1>Order Placed!</h1>
            <p>
              Your order <strong>#{orderId}</strong> has been placed successfully.
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

  return (
    <>
      <Navbar />
      <main className={styles.page}>
        <div className={styles.container}>
          <h1 className={styles.title}>Checkout</h1>
          <p className={styles.subtitle}>Complete your purchase</p>

          <form onSubmit={handlePlaceOrder} className={styles.layout}>
            <div className={styles.mainCol}>
              {/* Address */}
              <div className={styles.section}>
                <h2>Delivery Address</h2>
                <div className={styles.row}>
                  <input
                    placeholder="Full name"
                    required
                    value={address.name}
                    onChange={(e) => setAddress({ ...address, name: e.target.value })}
                  />
                  <input
                    placeholder="Phone"
                    required
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  />
                </div>
                <input
                  placeholder="Address (House no, street, area)"
                  required
                  value={address.line}
                  onChange={(e) => setAddress({ ...address, line: e.target.value })}
                />
                <div className={styles.row}>
                  <input
                    placeholder="City"
                    required
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  />
                  <input
                    placeholder="Pincode"
                    required
                    value={address.pincode}
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                  />
                </div>
              </div>

              {/* Payment */}
              <div className={styles.section}>
                <h2>Payment Method</h2>
                <div className={styles.payments}>
                  {PAYMENT_METHODS.map((m) => (
                    <label
                      key={m.id}
                      className={`${styles.payOption} ${
                        payment === m.id ? styles.payActive : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={m.id}
                        checked={payment === m.id}
                        onChange={() => setPayment(m.id)}
                      />
                      {m.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className={styles.summary}>
              <h2>Order Summary</h2>
              {cart.map((item) => (
                <div key={item.id} className={styles.rowLine}>
                  <span>
                    {item.name} × {item.qty}
                  </span>
                  <span>₹{(item.price * item.qty).toLocaleString("en-IN")}</span>
                </div>
              ))}
              <div className={styles.divider} />
              <div className={styles.rowLine}>
                <span>Subtotal</span>
                <span>₹{cartTotal.toLocaleString("en-IN")}</span>
              </div>
              <div className={styles.rowLine}>
                <span>Delivery</span>
                <span>₹{deliveryFee}</span>
              </div>
              <div className={styles.rowLine}>
                <span>GST (5%)</span>
                <span>₹{tax}</span>
              </div>
              {payment === "cod" && (
                <div className={styles.rowLine}>
                  <span>COD fee</span>
                  <span>₹{codFee}</span>
                </div>
              )}
              <div className={styles.totalRow}>
                <span>Total</span>
                <strong>₹{total.toLocaleString("en-IN")}</strong>
              </div>
              <button type="submit" className={styles.placeBtn}>
                {payment === "cod" ? "Place Order" : `Pay ₹${total.toLocaleString("en-IN")}`}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}