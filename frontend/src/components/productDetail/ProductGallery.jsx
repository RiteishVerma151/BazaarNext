import { useEffect, useState } from "react";
import api from "../../lib/axios.js";
import styles from "../../styles/ProductDetail/ProductGallery.module.css";

export default function ProductGallery({
  image,
  images = [],
  name = "Product",
  condition = "Used",
  color = "#7c4fd4",
  productId,
}) {
  const [wished, setWished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const galleryImages = images.length ? images : image ? [image] : [];

  useEffect(() => {
    setActiveImage(0);
  }, [productId]);

  useEffect(() => {
    let cancelled = false;

    const checkWishlist = async () => {
      if (!productId) return;

      try {
        const response = await api.get("/wishlist");
        const wishlist = response.data.wishlist ?? [];
        const exists = wishlist.some(
          (item) =>
            String(item._id ?? item.id) === String(productId)
        );

        if (!cancelled) setWished(exists);
      } catch {
        if (!cancelled) setWished(false);
      }
    };

    checkWishlist();

    return () => {
      cancelled = true;
    };
  }, [productId]);

  const handleWishlist = async () => {
    if (!productId || loading) return;

    setLoading(true);

    try {
      if (wished) {
        await api.delete(`/wishlist/${productId}`);
        setWished(false);
      } else {
        await api.post(`/wishlist/${productId}`);
        setWished(true);
      }
    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data?.message;

      alert(
        status === 401 || status === 403
          ? "Please log in to manage your wishlist."
          : message || "Could not update wishlist. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.imageArea} style={{ backgroundColor: color }}>
      <span className={styles.conditionBadge}>{condition}</span>

      <button
        type="button"
        className={styles.wishlistBtn}
        aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
        aria-pressed={wished}
        disabled={loading}
        onClick={handleWishlist}
        style={{
          color: wished ? "#e11d48" : "inherit",
          opacity: loading ? 0.6 : 1,
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill={wished ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>

      {galleryImages.length > 0 ? (
        <img
          src={galleryImages[activeImage]}
          alt={name}
          className={styles.mainImage}
        />
      ) : (
        <div
          className={styles.mainImage}
          style={{
            display: "grid",
            placeItems: "center",
            padding: 24,
          }}
        >
          No image available
        </div>
      )}

      {galleryImages.length > 1 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", padding: 12 }}>
          {galleryImages.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              onClick={() => setActiveImage(index)}
              aria-label={`View image ${index + 1}`}
              aria-pressed={activeImage === index}
              style={{
                border: activeImage === index ? "2px solid white" : "2px solid transparent",
                borderRadius: 6,
                padding: 2,
                background:"white",
                cursor: "pointer",
              }}
            >
              <img
                src={src}
                alt={`${name} ${index + 1}`}
                style={{
                  width: 54,
                  height: 54,
                  objectFit: "cover",
                  borderRadius: 4,
                  display: "block",
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}