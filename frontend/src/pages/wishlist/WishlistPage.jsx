
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/commoncomponents/Navbar.jsx";
import Footer from "../../components/commoncomponents/Footer.jsx";
import WishlistCard from "../../components/wishlist/WishlistCard.jsx";
import api from "../../lib/axios.js";
import styles from "../../styles/wishlist/WishlistPage.module.css";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchWishlist = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/wishlist");
      setWishlist(response.data?.wishlist ?? []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load your wishlist."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const handleRemove = async (productId) => {
    try {
      await api.delete(`/wishlist/${productId}`);

      // Update UI only after the backend confirms removal.
      setWishlist((previous) =>
        previous.filter(
          (item) => String(item._id ?? item.id) !== String(productId)
        )
      );
    } catch (err) {
      window.alert(
        err.response?.data?.message || "Could not remove this product."
      );
    }
  };

  return (
    <>
      <Navbar />

      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div>
              <h1>My Wishlist</h1>
              <p>Your saved items. Don't miss out on these deals!</p>
            </div>

            <span className={styles.itemCount}>
              {wishlist.length} {wishlist.length === 1 ? "item" : "items"}
            </span>
          </div>

          {loading ? (
            <div className={styles.emptyState}>
              <h2>Loading your wishlist...</h2>
            </div>
          ) : error ? (
            <div className={styles.emptyState}>
              <h2>Unable to load wishlist</h2>
              <p>{error}</p>
              <button type="button" onClick={fetchWishlist}>
                Try Again
              </button>
            </div>
          ) : wishlist.length > 0 ? (
            <div className={styles.grid}>
              {wishlist.map((item) => (
                <WishlistCard
                  key={item._id ?? item.id}
                  item={item}
                  onRemove={() => handleRemove(item._id ?? item.id)}
                />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>

              <h2>Your wishlist is empty</h2>
              <p>
                Looks like you haven't added anything yet. Explore our
                categories to find great deals.
              </p>

              <Link to="/shop" className={styles.shopBtn}>
                Continue Shopping
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
