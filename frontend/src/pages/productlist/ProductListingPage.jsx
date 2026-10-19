import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../../components/commoncomponents/Navbar.jsx";
import Footer from "../../components/commoncomponents/Footer.jsx";
import ProductCard from "../../components/commoncomponents/ProductCard.jsx";
import styles from "../../styles/productlist/ProductListingPage.module.css";

const PAGE_SIZE = 12;

const img = (id) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=600&q=80`;

// TODO: replace with real API data
const PRODUCTS = [
  { id: 1,  name: "School backpack",      price: 450,  condition: "Like new", info: "Ulhasnagar 1", image: img("1553062407-98eeb64c6a62"), category: "Bags",             keywords: "bag backpack school" },
  { id: 2,  name: "Laptop bag",           price: 650,  condition: "Good",     info: "Ulhasnagar 2", image: img("1548036328-c9fa89d128fa"), category: "Bags",             keywords: "bag laptop office" },
  { id: 3,  name: "Travel duffel bag",    price: 900,  condition: "Good",     info: "Ulhasnagar 3", image: img("1547949003-9792a18a2601"), category: "Bags",             keywords: "bag travel duffel" },
  { id: 4,  name: "College sling bag",    price: 300,  condition: "Fair",     info: "Ulhasnagar 4", image: img("1591561954557-26941169b49e"), category: "Bags",           keywords: "bag sling college" },
  { id: 5,  name: "Trekking rucksack",    price: 1800, condition: "Good",     info: "Ulhasnagar 1", image: img("1622260614153-03223fb72052"), category: "Bags",           keywords: "bag trekking rucksack" },
  { id: 6,  name: "Tote bag",             price: 150,  condition: "Like new", info: "Ulhasnagar 2", image: img("1590874103328-eac38a683ce7"), category: "Bags",           keywords: "bag tote" },
  { id: 7,  name: "Kids school bag",      price: 350,  condition: "Good",     info: "Ulhasnagar 5", image: img("1581605405669-fcdf81165afa"), category: "Bags",           keywords: "bag kids school" },
  { id: 8,  name: "Office messenger bag", price: 700,  condition: "Like new", info: "Ulhasnagar 3", image: img("1553062407-98eeb64c6a62"), category: "Bags",             keywords: "bag office messenger" },
  { id: 9,  name: "Gym bag",              price: 500,  condition: "Good",     info: "Ulhasnagar 4", image: img("1547949003-9792a18a2601"), category: "Bags",             keywords: "bag gym sports" },
  { id: 10, name: "Camera bag",           price: 1200, condition: "Fair",     info: "Ulhasnagar 1", image: img("1502920917128-1aa500764cbd"), category: "Bags",           keywords: "bag camera" },
  { id: 11, name: "Hand bag",             price: 400,  condition: "Good",     info: "Ulhasnagar 2", image: img("1584917865442-de89df76afd3"), category: "Bags",           keywords: "bag handbag ladies" },
  { id: 12, name: "Waterproof backpack",  price: 950,  condition: "Like new", info: "Ulhasnagar 3", image: img("1622560480605-d83c853bc5c3"), category: "Bags",           keywords: "bag backpack waterproof" },
  { id: 13, name: "Wheeled trolley bag",  price: 2200, condition: "Good",     info: "Ulhasnagar 5", image: img("1565026057447-bc90a3dceb87"), category: "Bags",           keywords: "bag trolley travel" },
  { id: 14, name: "Laptop backpack",      price: 1100, condition: "Good",     info: "Ulhasnagar 4", image: img("1622560480605-d83c853bc5c3"), category: "Bags",           keywords: "bag backpack laptop" },
  { id: 15, name: "Hero cycle",           price: 2800, condition: "Good",     info: "Ulhasnagar 3", image: img("1485965120184-e220f721d03e"), category: "Cycles",         keywords: "cycle bicycle" },
  { id: 16, name: "Study table",          price: 1200, condition: "Fair",     info: "Ulhasnagar 4", image: img("1555041469-a586c61ea9bc"), category: "Furniture",         keywords: "table study desk" },
  { id: 17, name: "Office chair",         price: 1500, condition: "Good",     info: "Ulhasnagar 2", image: img("1580480055273-228ff5388ef8"), category: "Furniture",       keywords: "chair office" },
  { id: 18, name: "Table fan",            price: 900,  condition: "Good",     info: "Ulhasnagar 2", image: img("1558618666-fcd25c85cd64"), category: "Daily essentials", keywords: "fan table" },
];

const CATEGORIES = ["All", ...Array.from(new Set(PRODUCTS.map((p) => p.category)))];

const pageNumbers = (current, total) => {
  if (total <= 6) return Array.from({ length: total }, (_, i) => i + 1);
  const out = [1];
  if (current > 3) out.push("…");
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) out.push(i);
  if (current < total - 2) out.push("…");
  out.push(total);
  return out;
};

export default function ProductListingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = (searchParams.get("q") || "").trim();
  const cat = searchParams.get("cat") || "All";
  const sort = searchParams.get("sort") || "default";
  const page = Math.max(1, parseInt(searchParams.get("page"), 10) || 1);

  const [query, setQuery] = useState(q);
  useEffect(() => setQuery(q), [q]);

  const term = q.toLowerCase();
  let results = PRODUCTS.filter((p) => {
    if (cat !== "All" && p.category !== cat) return false;
    if (term && !`${p.name} ${p.category} ${p.keywords}`.toLowerCase().includes(term)) return false;
    return true;
  });

  if (sort === "price-asc")  results = [...results].sort((a, b) => a.price - b.price);
  if (sort === "price-desc") results = [...results].sort((a, b) => b.price - a.price);

  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const visible = results.slice(start, start + PAGE_SIZE);

  const buildParams = (overrides = {}) => {
    const next = { q, cat, sort, page: 1, ...overrides };
    const out = {};
    if (next.q) out.q = next.q;
    if (next.cat && next.cat !== "All") out.cat = next.cat;
    if (next.sort && next.sort !== "default") out.sort = next.sort;
    if (next.page && next.page > 1) out.page = next.page;
    return out;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchParams(buildParams({ q: query.trim(), page: 1 }));
  };

  const setCategory = (c) => setSearchParams(buildParams({ cat: c, page: 1 }));
  const setSort     = (s) => setSearchParams(buildParams({ sort: s, page: 1 }));

  const goToPage = (n) => {
    setSearchParams(buildParams({ page: n }));
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
        {/* Search + chips */}
        <div className={styles.searchWrap}>
          <form className={styles.search} role="search" onSubmit={handleSubmit}>
            <span className={styles.searchIcon} aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
            <button className={`btn btn-primary ${styles.searchBtn}`} type="submit">
              Search
            </button>
          </form>

          <div className={styles.chips} role="tablist" aria-label="Categories">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                role="tab"
                aria-selected={cat === c}
                className={`${styles.chip} ${cat === c ? styles.chipActive : ""}`}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Header */}
        <div className={styles.head}>
          <div className={styles.headLeft}>
            <h1>
              {q ? `Results for “${q}”` : cat !== "All" ? cat : "All products"}
            </h1>
            <span className={styles.count}>
              {results.length} {results.length === 1 ? "item" : "items"}
            </span>
          </div>

          <label className={styles.sortWrap}>
            <span>Sort</span>
            <select
              className={styles.select}
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="default">Relevance</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </label>
        </div>

        {/* Grid */}
        {visible.length > 0 ? (
          <div className={styles.grid}>
            {visible.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <div className={styles.emptyIcon} aria-hidden="true">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            <h2>No items found</h2>
            <p>Try a different keyword like “cycle”, “books” or “chair”.</p>
            <button className={`btn btn-primary ${styles.emptyBtn}`} onClick={clearAll}>
              Clear search
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className={styles.pagination} aria-label="Pagination">
            <button
              type="button"
              className={styles.pageBtn}
              disabled={currentPage === 1}
              onClick={() => goToPage(currentPage - 1)}
            >
              ← Prev
            </button>

            {pageNumbers(currentPage, totalPages).map((n, i) =>
              n === "…" ? (
                <span key={`e${i}`} className={styles.ellipsis}>…</span>
              ) : (
                <button
                  key={n}
                  type="button"
                  className={`${styles.pageBtn} ${n === currentPage ? styles.active : ""}`}
                  aria-current={n === currentPage ? "page" : undefined}
                  onClick={() => goToPage(n)}
                >
                  {n}
                </button>
              )
            )}

            <button
              type="button"
              className={styles.pageBtn}
              disabled={currentPage === totalPages}
              onClick={() => goToPage(currentPage + 1)}
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