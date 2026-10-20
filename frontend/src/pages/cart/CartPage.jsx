import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/commoncomponents/Navbar.jsx";
import Footer from "../../components/commoncomponents/Footer.jsx";
import { useCart } from "../../context/CartContext";
import styles from "../../styles/cart/CartPage.module.css";

export default function CartPage() {
  const { cart, removeFromCart, updateQty, cartTotal, cartCount } = useCart();
  const navigate = useNavigate();

  const deliveryFee = cart.length > 0 ? 40 : 0;
  const tax = Math.round(cartTotal * 0.05);
  const grandTotal = cartTotal + deliveryFee + tax;

  return (
    <>
      <Navbar />
      <main className={styles.page}>
        <div className={styles.container}>
          <h1 className={styles.title}>Shopping Cart</h1>
          <p className={styles.subtitle}>
            {cartCount} {cartCount === 1 ? "item" : "items"}
          </p>

          {cart.length === 0 ? (
            <div className={styles.empty}>
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>🛒</div>
              <h2>Your cart is empty</h2>
              <p>Add items to get started</p>
              <Link to="/products" className={styles.shopBtn}>
                Browse Products
              </Link>
            </div>
          ) : (
            <div className={styles.layout}>
              <div className={styles.cartList}>
                {cart.map((item) => (
                  <div key={item.id} className={styles.cartItem}>
                    <img src={item.image} alt={item.name} className={styles.itemImg} />
                    <div className={styles.itemInfo}>
                      <h3>{item.name}</h3>
                      <p className={styles.itemPrice}>
                        ₹{item.price.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div className={styles.qtyControl}>
                      <button onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
                      <span>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                    </div>
                    <p className={styles.itemTotal}>
                      ₹{(item.price * item.qty).toLocaleString("en-IN")}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className={styles.removeBtn}
                      aria-label="Remove"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div className={styles.summary}>
                <h2>Order Summary</h2>
                <div className={styles.row}>
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toLocaleString("en-IN")}</span>
                </div>
                <div className={styles.row}>
                  <span>Delivery</span>
                  <span>₹{deliveryFee}</span>
                </div>
                <div className={styles.row}>
                  <span>GST (5%)</span>
                  <span>₹{tax}</span>
                </div>
                <div className={styles.totalRow}>
                  <span>Total</span>
                  <strong>₹{grandTotal.toLocaleString("en-IN")}</strong>
                </div>
                <button
                  className={styles.checkoutBtn}
                  onClick={() => navigate("/checkout")}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}