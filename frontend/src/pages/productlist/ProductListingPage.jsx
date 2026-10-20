
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../../components/commoncomponents/Navbar.jsx";
import Footer from "../../components/commoncomponents/Footer.jsx";
import ProductCard from "../../components/commoncomponents/ProductCard.jsx";
import api from "../../lib/axios.js";
import styles from "../../styles/productlist/ProductListingPage.module.css";

const PAGE_SIZE = 12;

const CATEGORIES = [
  "All",
  "Electronics",
  "Fashion",
  "Books",
  "Furniture",
  "Home Appliances",
  "Sports",
  "Vehicles",
  "Other",
];

const CONDITIONS = ["All", "Like New", "Good", "Fair"];

const pageNumbers = (current, total) => {
  if (total <= 6) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const out = [1];

  if (current > 3) out.push("…");

  for (
    let i = Math.max(2, current - 1);
    i <= Math.min(total - 1, current + 1);
    i++
  ) {
    out.push(i);
  }

  if (current < total - 2) out.push("…");

  out.push(total);
  return out;
};

const getImageUrl = (path) => {
  if (!path) return "";

  if (/^https?:\/\//i.test(path)) return path;

  const baseURL = "http://localhost:3001";

  return `${baseURL}${path.startsWith("/") ? "" : "/"}${path}`;
};

export default function ProductListingPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const q = (searchParams.get("q") || "").trim();
  const cat = searchParams.get("cat") || "All";
  const sort = searchParams.get("sort") || "default";
  const condition = searchParams.get("condition") || "All";
  const page = Math.max(
    1,
    parseInt(searchParams.get("page"), 10) || 1
  );

  const [query, setQuery] = useState(q);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setQuery(q);
  }, [q]);

  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const params = {
          page,
          limit: PAGE_SIZE,
          sort,
        };

        if (q) params.search = q;
        if (cat !== "All") params.category = cat;
        if (condition !== "All") params.condition = condition;

        const response = await api.get("/products", { params });

        if (cancelled) return;

        const data = response.data;

        const normalizedProducts = (data.products ?? []).map(
          (product) => ({
            ...product,
            id: product.id ?? product._id,
            name: product.title,
            image: getImageUrl(
              product.images?.[0] ?? product.image
            ),
            info:
              typeof product.location === "string"
                ? product.location
                : product.seller?.name || "Location not specified",
          })
        );

        setProducts(normalizedProducts);
        setTotal(data.total ?? normalizedProducts.length);
        setTotalPages(data.totalPages ?? 0);
      } catch (err) {
        if (cancelled) return;

        setProducts([]);
        setTotal(0);
        setTotalPages(0);
        setError(
          err.response?.data?.message ||
            "Failed to load products. Please try again."
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, [q, cat, condition, sort, page]);

  const buildParams = (overrides = {}) => {
    const next = {
      q,
      cat,
      sort,
      condition,
      page: 1,
      ...overrides,
    };

    const out = {};

    if (next.q) out.q = next.q;
    if (next.cat && next.cat !== "All") out.cat = next.cat;
    if (next.sort && next.sort !== "default") out.sort = next.sort;
    if (next.condition && next.condition !== "All") {
      out.condition = next.condition;
    }
    if (next.page && next.page > 1) out.page = next.page;

    return out;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setSearchParams(
      buildParams({
        q: query.trim(),
        page: 1,
      })
    );
  };

  const setCategory = (category) => {
    setSearchParams(buildParams({ cat: category, page: 1 }));
  };

  const setSort = (value) => {
    setSearchParams(buildParams({ sort: value, page: 1 }));
  };

  const setCondition = (value) => {
    setSearchParams(buildParams({ condition: value, page: 1 }));
  };

  const goToPage = (nextPage) => {
    setSearchParams(buildParams({ page: nextPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearAll = () => {
    setQuery("");
    setSearchParams({});
  };

  return (
    <>
      <Navbar />

      <main className={`wrap ${styles.page}`}>
        <div className={styles.searchWrap}>
          <form
            className={styles.search}
            role="search"
            onSubmit={handleSubmit}
          >
            <span className={styles.searchIcon} aria-hidden="true">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </span>

            <input
              type="search"
              placeholder="Search for a cycle, books, bag…"
              aria-label="Search products"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <button
              className={`btn btn-primary ${styles.searchBtn}`}
              type="submit"
            >
              Search
            </button>
          </form>

          <div
            className={styles.chips}
            role="tablist"
            aria-label="Categories"
          >
            {CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={cat === category}
                className={`${styles.chip} ${
                  cat === category ? styles.chipActive : ""
                }`}
                onClick={() => setCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.head}>
          <div className={styles.headLeft}>
            <h1>
              {q
                ? `Results for “${q}”`
                : cat !== "All"
                  ? cat
                  : "All products"}
            </h1>

            <span className={styles.count}>
              {total} {total === 1 ? "item" : "items"}
            </span>
          </div>

          <div className={styles.sortWrap}>
            <label htmlFor="product-sort">Sort</label>
            <select
              id="product-sort"
              className={styles.select}
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="default">Latest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>

            <label htmlFor="product-condition">Condition</label>
            <select
              id="product-condition"
              className={styles.select}
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
            >
              {CONDITIONS.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className={styles.empty}>
            <h2>Loading products...</h2>
            <p>Finding available items for you.</p>
          </div>
        ) : error ? (
          <div className={styles.empty}>
            <h2>Could not load products</h2>
            <p>{error}</p>
            <button
              type="button"
              className={`btn btn-primary ${styles.emptyBtn}`}
              onClick={() => setSearchParams(buildParams())}
            >
              Try Again
            </button>
          </div>
        ) : products.length > 0 ? (
          <div className={styles.grid}>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <div className={styles.emptyIcon} aria-hidden="true">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>

            <h2>No items found</h2>
            <p>
              Try a different keyword or choose another category.
            </p>

            <button
              type="button"
              className={`btn btn-primary ${styles.emptyBtn}`}
              onClick={clearAll}
            >
              Clear filters
            </button>
          </div>
        )}

        {!loading && !error && totalPages > 1 && (
          <nav className={styles.pagination} aria-label="Pagination">
            <button
              type="button"
              className={styles.pageBtn}
              disabled={page <= 1}
              onClick={() => goToPage(page - 1)}
            >
              ← Prev
            </button>

            {pageNumbers(page, totalPages).map((number, index) =>
              number === "…" ? (
                <span
                  key={`ellipsis-${index}`}
                  className={styles.ellipsis}
                >
                  …
                </span>
              ) : (
                <button
                  key={number}
                  type="button"
                  className={`${styles.pageBtn} ${
                    number === page ? styles.active : ""
                  }`}
                  aria-current={number === page ? "page" : undefined}
                  onClick={() => goToPage(number)}
                >
                  {number}
                </button>
              )
            )}

            <button
              type="button"
              className={styles.pageBtn}
              disabled={page >= totalPages}
              onClick={() => goToPage(page + 1)}
            >
              Next →
            </button>
          </nav>
        )}
      </main>

      <Footer />
    </>
  );
}
