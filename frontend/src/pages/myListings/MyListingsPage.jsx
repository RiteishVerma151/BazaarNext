
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../../components/commoncomponents/Navbar.jsx";
import Footer from "../../components/commoncomponents/Footer.jsx";
import ListingCard from "../../components/myListings/ListingCard.jsx";
import api from "../../lib/axios.js";
import styles from "../../styles/myListings/MyListingsPage.module.css";

const TABS = ["All", "Active", "Sold"];

export default function MyListingsPage() {
  const [listings, setListings] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchListings = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/products/mine");
      setListings(response.data?.products ?? []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load your listings."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`);

      setListings((previous) =>
        previous.filter((item) => (item.id ?? item._id) !== id)
      );

      toast.success("Listing deleted successfully!");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Could not remove this listing."
      );

      throw err;
    }
  };

  const filteredListings = listings.filter((item) => {
    if (activeTab === "All") return true;
    if (activeTab === "Active") return item.status === "AVAILABLE";
    if (activeTab === "Sold") return item.status === "SOLD";
    return false;
  });

  return (
    <>
      <Navbar />

      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div>
              <h1>My Listings</h1>
              <p>Manage the items you are selling on BazaarNext</p>
            </div>

            <Link to="/sell" className={styles.addBtn}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Sell New Item
            </Link>
          </div>

          <div className={styles.tabsWrap}>
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                className={`${styles.tabBtn} ${
                  activeTab === tab ? styles.activeTab : ""
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {loading ? (
            <p>Loading your listings...</p>
          ) : error ? (
            <div className={styles.emptyState}>
              <h2>Unable to load listings</h2>
              <p>{error}</p>
              <button type="button" onClick={fetchListings}>
                Try Again
              </button>
            </div>
          ) : filteredListings.length > 0 ? (
            <div className={styles.grid}>
              {filteredListings.map((item) => (
                <ListingCard
                  key={item.id ?? item._id}
                  listing={item}
                  onDelete={() => handleDelete(item.id ?? item._id)}
                />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
              </div>

              <h2>
                No {activeTab !== "All" ? activeTab.toLowerCase() : ""} listings
                found
              </h2>
              <p>You haven't added any items to this section yet.</p>
              <Link to="/sell" className={styles.emptyShopBtn}>
                Start Selling
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
