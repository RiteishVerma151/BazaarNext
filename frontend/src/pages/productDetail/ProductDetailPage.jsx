
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../lib/axios.js";

import Navbar from "../../components/commoncomponents/Navbar";
import Footer from "../../components/commoncomponents/Footer.jsx";
import ProductGallery from "../../components/productDetail/ProductGallery.jsx";
import ProductHeader from "../../components/productDetail/ProductHeader.jsx";
import ProductActions from "../../components/productDetail/ProductActions.jsx";
import ProductSellerCard from "../../components/productDetail/ProductSellerCard.jsx";
import ProductTabs from "../../components/productDetail/ProductTabs.jsx";
import styles from "../../styles/ProductDetail/ProductDetailPage.module.css";
import extras from "./ProductExtras.module.css";

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
  if (/^https?:\/\//i.test(image)) return image;

  const baseURL = api.defaults.baseURL || "https://bazaarnext.onrender.com/api";
  const serverURL = baseURL.replace(/\/api\/?$/, "");

  return `${serverURL}/${image.replace(/^\/+/, "")}`;
};

const getLocation = (location) => {
  if (!location) return "Location not specified";
  if (typeof location === "string") return location;
  if (location.city) return location.city;
  if (location.address) return location.address;

  return "Location not specified";
};

const formatPrice = (price) =>
  Number(price || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });

const formatDate = (value) => {
  if (!value) return "Recently";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getProductId = (product) =>
  String(product?.id ?? product?._id ?? "");

const getSellerId = (seller) => {
  if (!seller) return "";
  if (typeof seller === "string") return seller;

  return String(seller._id ?? seller.id ?? "");
};

function StarRating({ rating = 0, size = "normal" }) {
  const roundedRating = Math.round(Number(rating) || 0);

  return (
    <span
      className={`${extras.stars} ${
        size === "large" ? extras.largeStars : ""
      }`}
      aria-label={`${Number(rating || 0).toFixed(1)} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={star <= roundedRating ? extras.starFilled : extras.starEmpty}
        >
          ★
        </span>
      ))}
    </span>
  );
}

function SellerReviews({ seller, reviews, loading, error }) {
  const averageRating = Number(seller?.avgRating) || 0;
  const ratingCount = Number(seller?.ratingCount) || 0;

  return (
    <section className={extras.section} id="seller-reviews">
      <div className={extras.sectionHeading}>
        <div>
          <p className={extras.eyebrow}>CUSTOMER FEEDBACK</p>
          <h2>Seller Ratings & Reviews</h2>
          <p className={extras.sectionDescription}>
            See what other buyers and sellers say about this seller.
          </p>
        </div>
      </div>

      <div className={extras.ratingSummary}>
        <div className={extras.ratingScore}>
          <strong>{averageRating.toFixed(1)}</strong>
          <StarRating rating={averageRating} size="large" />
          <span>
            {ratingCount} {ratingCount === 1 ? "rating" : "ratings"}
          </span>
        </div>

        <div className={extras.ratingSummaryText}>
          <h3>
            {ratingCount > 0 ? "Community feedback" : "No ratings yet"}
          </h3>
          <p>
            {ratingCount > 0
              ? "This score reflects ratings received by the seller."
              : "Be among the first to share feedback after a completed transaction."}
          </p>
        </div>
      </div>

      <div className={extras.reviewList}>
        {loading ? (
          <p className={extras.mutedText}>Loading reviews...</p>
        ) : error ? (
          <p className={extras.mutedText}>{error}</p>
        ) : reviews.length === 0 ? (
          <div className={extras.emptyState}>
            <span className={extras.emptyIcon}>☆</span>
            <h3>No written reviews yet</h3>
            <p>Written feedback from completed transactions will appear here.</p>
          </div>
        ) : (
          reviews.map((review) => {
            const reviewer =
              typeof review.reviewer === "object" && review.reviewer
                ? review.reviewer
                : {};

            const reviewId = review._id || review.id;

            return (
              <article className={extras.reviewCard} key={reviewId}>
                <div className={extras.reviewTop}>
                  <div className={extras.reviewerAvatar}>
                    {(reviewer.name || "U").trim().charAt(0).toUpperCase()}
                  </div>

                  <div className={extras.reviewerInfo}>
                    <strong>{reviewer.name || "BazaarNext user"}</strong>
                    <span>{formatDate(review.createdAt)}</span>
                  </div>

                  <StarRating rating={review.rating} />
                </div>

                {review.comment?.trim() ? (
                  <p className={extras.reviewComment}>{review.comment}</p>
                ) : (
                  <p className={extras.mutedText}>Rating submitted without a comment.</p>
                )}

                {review.order?.product?.title && (
                  <p className={extras.reviewProduct}>
                    Purchase: {review.order.product.title}
                  </p>
                )}
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}

function SimilarProducts({ products, loading, currentProductId }) {
  const recommendations = products
    .filter((item) => getProductId(item) !== String(currentProductId))
    .slice(0, 4);

  return (
    <section className={extras.section}>
      <div className={extras.sectionHeading}>
        <div>
          <p className={extras.eyebrow}>YOU MAY ALSO LIKE</p>
          <h2>Similar Products</h2>
          <p className={extras.sectionDescription}>
            Discover more finds from the same category.
          </p>
        </div>
      </div>

      {loading ? (
        <p className={extras.mutedText}>Finding similar products...</p>
      ) : recommendations.length === 0 ? (
        <div className={extras.emptyState}>
          <h3>No similar products available yet</h3>
          <p>Check back later for more listings in this category.</p>
        </div>
      ) : (
        <div className={extras.productGrid}>
          {recommendations.map((item) => {
            const itemId = getProductId(item);
            const image = getImageUrl(item.images?.[0] ?? item.image);

            const seller =
              typeof item.seller === "object" && item.seller
                ? item.seller
                : null;

            return (
              <Link
                to={`/product/${itemId}`}
                className={extras.productCard}
                key={itemId}
              >
                <div className={extras.productImageWrap}>
                  {image ? (
                    <img
                      src={image}
                      alt={item.title || "Similar product"}
                      className={extras.productImage}
                      loading="lazy"
                    />
                  ) : (
                    <div className={extras.imagePlaceholder}>
                      No image
                    </div>
                  )}

                  {item.condition && (
                    <span className={extras.conditionBadge}>
                      {item.condition}
                    </span>
                  )}
                </div>

                <div className={extras.productInfo}>
                  <span className={extras.productCategory}>
                    {item.category || "Marketplace"}
                  </span>

                  <h3>{item.title || "Untitled product"}</h3>

                  <strong className={extras.productPrice}>
                    ₹{formatPrice(item.price)}
                  </strong>

                  {seller && (
                    <div className={extras.miniRating}>
                      <span>★</span>
                      <span>
                        {Number(seller.avgRating || 0).toFixed(1)}
                      </span>
                      <span className={extras.ratingCount}>
                        ({Number(seller.ratingCount || 0)})
                      </span>
                    </div>
                  )}

                  <span className={extras.viewProduct}>
                    View product →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [similarProducts, setSimilarProducts] = useState([]);
  const [similarLoading, setSimilarLoading] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchProduct = async () => {
      setLoading(true);
      setError("");
      setProduct(null);
      setSimilarProducts([]);
      setReviews([]);
      setReviewsError("");

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

        if (!cancelled) setProduct(normalizedProduct);
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Unable to load this product."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if (id) fetchProduct();

    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!product?.category) return undefined;

    let cancelled = false;

    const fetchSimilarProducts = async () => {
      setSimilarLoading(true);

      try {
        const response = await api.get("/products", {
          params: {
            category: product.category,
            limit: 8,
            page: 1,
          },
        });

        if (!cancelled) {
          setSimilarProducts(
            Array.isArray(response.data?.products)
              ? response.data.products
              : []
          );
        }
      } catch {
        if (!cancelled) setSimilarProducts([]);
      } finally {
        if (!cancelled) setSimilarLoading(false);
      }
    };

    fetchSimilarProducts();

    return () => {
      cancelled = true;
    };
  }, [product?.category, product?.id]);

  const sellerId = getSellerId(product?.seller);

  useEffect(() => {
    if (!sellerId) {
      setReviews([]);
      return undefined;
    }

    let cancelled = false;

    const fetchSellerReviews = async () => {
      setReviewsLoading(true);
      setReviewsError("");

      try {
        const response = await api.get(`/reviews/user/${sellerId}`);
        const data = response.data;

        const list = Array.isArray(data)
          ? data
          : data?.reviews ??
            data?.userReviews ??
            data?.data?.reviews ??
            [];

        if (!cancelled) {
          setReviews(Array.isArray(list) ? list : []);
        }
      } catch (err) {
        if (!cancelled) {
          setReviews([]);
          setReviewsError(
            err.response?.data?.message || "Unable to load written reviews."
          );
        }
      } finally {
        if (!cancelled) setReviewsLoading(false);
      }
    };

    fetchSellerReviews();

    return () => {
      cancelled = true;
    };
  }, [sellerId]);

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

          <SellerReviews
            seller={seller}
            reviews={reviews}
            loading={reviewsLoading}
            error={reviewsError}
          />

          <SimilarProducts
            products={similarProducts}
            loading={similarLoading}
            currentProductId={product.id}
          />
        </div>
      </main>

      <Footer />
    </>
  );
}
