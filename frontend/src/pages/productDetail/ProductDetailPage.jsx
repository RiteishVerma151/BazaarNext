import { Link } from "react-router-dom";
import Navbar from "../../components/commoncomponents/Navbar.jsx";
import Footer from "../../components/commoncomponents/Footer.jsx";
import ProductGallery from "../../components/productDetail/ProductGallery.jsx";
import ProductSellerCard from "../../components/productDetail/ProductSellerCard.jsx";
import ProductTabs from "../../components/productDetail/ProductTabs.jsx";
import styles from "../../styles/ProductDetail/ProductDetailPage.module.css"; // CSS paas me hi hai

export default function ProductDetailPage() {
  return (
    <>
      <Navbar />
      <main className={styles.page}>
        <div className={styles.container}>
          
          {/* Breadcrumbs */}
          <nav className={styles.breadcrumb}>
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/shop">Shop</Link>
            <span>/</span>
            <span className={styles.current}>Backpack</span>
          </nav>

          {/* Main Product Section */}
          <div className={styles.productSection}>
            
            {/* Left: Image Component */}
            <ProductGallery />

            {/* Right: Details Area */}
            <div className={styles.detailsArea}>
              <h1 className={styles.title}>Premium leather backpack</h1>
              
              <div className={styles.meta}>
                <span className={styles.location}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  Ulhasnagar 2
                </span>
                <span className={styles.posted}>Posted 2 days ago</span>
              </div>

              <div className={styles.priceRow}>
                <span className={styles.price}>₹1,250</span>
                <span className={styles.negotiable}>Negotiable</span>
              </div>

              {/* Seller Component */}
              <ProductSellerCard />

              <div className={styles.actions}>
                <button className={styles.buyBtn}>Buy Now</button>
                <button className={styles.offerBtn}>Make an Offer</button>
              </div>

              <p className={styles.safetyText}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                Always meet in a public place and inspect the item before paying.
              </p>

              {/* Tabs Component */}
              <ProductTabs />
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}