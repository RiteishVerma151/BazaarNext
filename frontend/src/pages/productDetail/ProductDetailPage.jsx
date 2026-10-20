import { Link, useParams } from "react-router-dom";
import Navbar from "../../components/commoncomponents/Navbar.jsx";
import Footer from "../../components/commoncomponents/Footer.jsx";
import ProductGallery from "../../components/productDetail/ProductGallery.jsx";
import ProductHeader from "../../components/productDetail/ProductHeader.jsx";
import ProductActions from "../../components/productDetail/ProductActions.jsx";
import ProductSellerCard from "../../components/productDetail/ProductSellerCard.jsx";
import ProductTabs from "../../components/productDetail/ProductTabs.jsx";
import { PRODUCTS } from "../../data/products.js";
import { getSeller } from "../../data/sellers.js";
import styles from "../../styles/productDetail/ProductDetailPage.module.css";

const CATEGORY_COLORS = {
  Bags: "#7A4FD1",
  Cycles: "#0F7A6B",
  Furniture: "#D6573C",
  "Daily essentials": "#2C7A7B",
};
const colorOf = (category) => CATEGORY_COLORS[category] || "#2B6CB0";

export default function ProductDetailPage() {
  const { id } = useParams();
  const found = PRODUCTS.find((p) => String(p.id) === id);

  if (!found) {
    return (
      <>
        <Navbar />
        <main className={styles.page}>
          <div className={styles.container}>
            <h1 className={styles.title}>Product not found</h1>
            <p style={{ margin: "12px 0 20px" }}>This listing may have been removed.</p>
            <Link to="/products">Browse products</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const product = { ...found, color: colorOf(found.category), location: found.info };
  const seller = getSeller(product.id);

  return (
    <>
      <Navbar />
      <main className={styles.page}>
        <div className={styles.container}>

          <nav className={styles.breadcrumb}>
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/products">Shop</Link>
            <span>/</span>
            <Link to={`/products?cat=${encodeURIComponent(product.category)}`}>
              {product.category}
            </Link>
            <span>/</span>
            <span className={styles.current}>{product.name}</span>
          </nav>

          <div className={styles.productSection}>
            <ProductGallery
              image={product.image}
              name={product.name}
              condition={product.condition}
              color={product.color}
            />

            <div className={styles.detailsArea}>
              {/* ✅ Header (title + meta + price) */}
              <ProductHeader
                name={product.name}
                location={product.location}
                price={product.price}
              />

              <ProductSellerCard seller={seller} />

              {/* ✅ Actions (buttons + safety + toast) */}
              <ProductActions productId={product.id} product={product} />

              <ProductTabs
                description={product.description}
                category={product.category}
                condition={product.condition}
                location={product.location}
              />
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}