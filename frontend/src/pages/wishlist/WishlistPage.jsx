import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/commoncomponents/Navbar.jsx";
import Footer from "../../components/commoncomponents/Footer.jsx";
import WishlistCard from "../../components/wishlist/WishlistCard.jsx";
import styles from "../../styles/wishlist/WishlistPage.module.css";

// Mock Data (API aane par isko replace karna)
const INITIAL_WISHLIST = [
  { id: 1, name: "Premium leather backpack", price: 1250, condition: "Like new", info: "Ulhasnagar 2", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80", category: "Bags" },
  { id: 2, name: "Table fan", price: 900, condition: "Good", info: "Ulhasnagar 4", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80", category: "Daily essentials" },
  { id: 3, name: "Hero cycle", price: 2800, condition: "Good", info: "Ulhasnagar 3", image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80", category: "Cycles" },
];

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState(INITIAL_WISHLIST);

  // Remove item from wishlist
  const handleRemove = (id) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
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

          {wishlist.length > 0 ? (
            <div className={styles.grid}>
              {wishlist.map((item) => (
                <WishlistCard 
                  key={item.id} 
                  item={item} 
                  onRemove={() => handleRemove(item.id)} 
                />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <h2>Your wishlist is empty</h2>
              <p>Looks like you haven't added anything yet. Explore our categories to find great deals.</p>
              <Link to="/shop" className={styles.shopBtn}>Continue Shopping</Link>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}