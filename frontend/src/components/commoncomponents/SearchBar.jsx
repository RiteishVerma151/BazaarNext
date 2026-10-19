import { useState } from "react";
import styles from "../../styles/commonComponent/SearchBar.module.css";

export default function SearchBar() {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: navigate to product listing page with ?q=query
    console.log("Search:", query);
  };

  return (
    <form className={styles.search} role="search" onSubmit={handleSubmit}>
      <input
        type="search"
        placeholder="Search for a cycle, books, sofa…"
        aria-label="Search products"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button className={`btn btn-primary ${styles.btn}`} type="submit" aria-label="Search">
        <span className={styles.btnText}>Search</span>
        <svg className={styles.btnIcon} viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
      </button>
    </form>
  );
}