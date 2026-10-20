import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import styles from "../../styles/productDetail/ProductActions.module.css";

export default function ProductActions({ productId, product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [toast, setToast] = useState(false);

  const handleBuyNow = () => {
  if (!product) {
    alert("Product data missing");
    return;
  }
  addToCart(product);      
  navigate("/checkout");  
};

  const handleAddToCart = () => {
    if (!product) {
      alert("Product data missing");
      return;
    }
    addToCart(product);
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  };

  return (
    <>
      <div className={styles.actions}>
        <button className={styles.buyBtn} onClick={handleBuyNow}>
          Buy Now
        </button>
        <button className={styles.offerBtn} onClick={handleAddToCart}>
          Add to Cart
        </button>
        <button
          className={styles.offerBtn}
          onClick={() => navigate(`/chat/${productId}`)}
        >
          Chat with seller
        </button>
      </div>

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

      {/* Toast */}
      {toast && (
        <div className={styles.toast}>
          <span>✅ Added to cart</span>
          <Link to="/cart" className={styles.toastLink}>
            View Cart →
          </Link>
        </div>
      )}
    </>
  );
}