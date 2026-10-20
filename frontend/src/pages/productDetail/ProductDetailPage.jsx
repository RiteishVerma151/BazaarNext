import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../lib/axios.js";

import Navbar from "../../components/commoncomponents/Navbar.jsx";
import Footer from "../../components/commoncomponents/Footer.jsx";
import ProductGallery from "../../components/productDetail/ProductGallery.jsx";
import ProductHeader from "../../components/productDetail/ProductHeader.jsx";
import ProductActions from "../../components/productDetail/ProductActions.jsx";
import ProductSellerCard from "../../components/productDetail/ProductSellerCard.jsx";
import ProductTabs from "../../components/productDetail/ProductTabs.jsx";
import styles from "../../styles/productDetail/ProductDetailPage.module.css";

const CATEGORY_COLORS = {
  Electronics: "#2B6CB0",
  Fashion: "#7A4FD1",
  Books: "#0F7A6B",
  Furniture: "#D6573C",
  "Home Appliances": "#2C7A7B",
  Sports: "#B7791F",
  Vehicles: "#4A5568",
  Other: "#2B6CB0",
};

const colorOf = (category) => CATEGORY_COLORS[category] || "#2B6CB0";

const getImageUrl = (image) => {
  if (!image) return null;
  if (image.startsWith("http")) return image;

  return `http://localhost:3001${image.startsWith("/") ? "" : "/"}${image}`;
};

const getLocation = (location) => {
  if (!location) return "Location not specified";

  // Supports a future textual location as well as GeoJSON.
  if (typeof location === "string") return location;
  if (location.city) return location.city;
  if (location.address) return location.address;

  return "Location not specified";
};

export default function ProductDetailPage() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchProduct = async () => {
      setLoading(true);
      setError("");
      setProduct(null);

      try {
        const response = await api.get(`/products/${id}`);
        const data = response.data.product;

        if (!data) {
          throw new Error("Product details were not returned by the server.");
        }

        const normalizedProduct = {
          ...data,
          id: data.id ?? data._id,
          name: data.title ?? data.name ?? "Untitled product",
          image: getImageUrl(data.images?.[0] ?? data.image),
          images: (data.images ?? []).map(getImageUrl).filter(Boolean),
          location: getLocation(data.location),
          color: colorOf(data.category),
        };

        if (!cancelled) {
          setProduct(normalizedProduct);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Unable to load this product.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    if (id) fetchProduct();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className={styles.page}>
          <div className={styles.container}>
            <p>Loading product details...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Navbar />
        <main className={styles.page}>
          <div className={styles.container}>
            <h1 className={styles.title}>Product not found</h1>
            <p style={{ margin: "12px 0 20px" }}>
              {error || "This listing may have been removed."}
            </p>
            <Link to="/products">Browse products</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const seller =
    typeof product.seller === "object" && product.seller !== null
      ? product.seller
      : { name: "BazaarNext Seller" };

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
              images={product.images}
              name={product.name}
              condition={product.condition}
              color={product.color}
              productId={product.id}
            />

            <div className={styles.detailsArea}>
              <ProductHeader
                name={product.name}
                location={product.location}
                price={product.price}
              />

              <ProductSellerCard seller={seller} />

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
