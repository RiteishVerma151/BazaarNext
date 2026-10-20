import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/axios.js";
import styles from "../../styles/commonComponent/ProductCard.module.css";

export default function ProductCard({ product }) {
  const [wished, setWished] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const id = product._id ?? product.id;
  const name = product.title ?? product.name ?? "Untitled product";
  const price = Number(product.price ?? 0);
  const condition = product.condition ?? "Used";

  const info =
    product.description ??
    product.info ??
    product.location?.city ??
    "Pre-owned product";

  const imageValue = product.images?.[0] ?? product.image;

  const image = imageValue
    ? imageValue.startsWith("http")
      ? imageValue
      : `https://bazaarnext.onrender.com${
          imageValue.startsWith("/") ? "" : "/"
        }${imageValue}`
    : null;

  const color = product.color ?? "#f3f4f6";

  // Check whether this product already exists in the user's wishlist.
  useEffect(() => {
    let cancelled = false;

    const checkWishlist = async () => {
      try {
        const response = await api.get("/wishlist");
        const wishlist = response.data.wishlist ?? [];

        const isWished = wishlist.some(
          (item) => String(item._id ?? item.id) === String(id)
        );

        if (!cancelled) {
          setWished(isWished);
        }
      } catch {
        // User may not be logged in. Keep the heart inactive.
        if (!cancelled) {
          setWished(false);
        }
      }
    };

    if (id) {
      checkWishlist();
    }

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleWishlist = async () => {
    if (!id || wishlistLoading) return;

    setWishlistLoading(true);

    try {
      if (wished) {
        await api.delete(`/wishlist/${id}`);
        setWished(false);
      } else {
        await api.post(`/wishlist/${id}`);
        setWished(true);
      }
    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 401 || status === 403) {
        alert("Please log in to manage your wishlist.");
      } else {
        alert(message || "Could not update wishlist. Please try again.");
      }
    } finally {
      setWishlistLoading(false);
    }
  };

  return (
    <article className={styles.prod}>
      <div className={styles.prodImg} style={{ background: color }}>
        {image && <img src={image} alt={name} />}

        <span className={styles.cond}>{condition}</span>

        <button
          type="button"
          className={`${styles.wish} ${wished ? styles.on : ""}`}
          aria-pressed={wished}
          aria-label={`${wished ? "Remove" : "Add"} ${name} ${
            wished ? "from" : "to"
          } wishlist`}
          disabled={wishlistLoading}
          onClick={handleWishlist}
        >
          {wishlistLoading ? "…" : wished ? "♥" : "♡"}
        </button>
      </div>

      <div className={styles.prodBody}>
        <h3>
          <Link to={`/product/${id}`}>{name}</Link>
        </h3>

        <span className={styles.meta}>{info}</span>

        <div className={styles.prodRow}>
          <span className={styles.price}>
            ₹{price.toLocaleString("en-IN")}
          </span>

          <Link to={`/product/${id}`}>View details</Link>
        </div>
      </div>
    </article>
  );
}