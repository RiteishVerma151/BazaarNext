import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/commoncomponents/Navbar.jsx";
import Footer from "../../components/commoncomponents/Footer.jsx";
import ListingCard from "../../components/myListings/ListingCard.jsx";
import styles from "../../styles/myListings/MyListingsPage.module.css";

// Mock Data (API aane par replace karna)
const INITIAL_LISTINGS = [
  { 
    id: 101, 
    title: "Premium leather backpack", 
    price: 1250, 
    stock: 3,        // 👈 abhi kitne bache
    sold: 7,         // 👈 kitne log kharid chuke
    status: "Active", 
    category: "Bags", 
    condition: "Like new", 
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=400&q=80",
  },
  { 
    id: 102, 
    title: "Hero cycle 26T", 
    price: 2800, 
    stock: 1,        // 👈 last piece bacha
    sold: 0,         // 👈 koi nahi kharida abhi tak
    status: "Active", 
    category: "Cycles", 
    condition: "Good", 
    image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=400&q=80",
  },
  { 
    id: 103, 
    title: "Study table (Wooden)", 
    price: 1200, 
    stock: 0,        // 👈 sab bik gaye
    sold: 5,         // 👈 5 log kharid chuke
    status: "Sold", 
    category: "Furniture", 
    condition: "Fair", 
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80",
  },
];

const TABS = ["All", "Active", "Sold"];

export default function MyListingsPage() {
  const [listings, setListings] = useState(INITIAL_LISTINGS);
  const [activeTab, setActiveTab] = useState("All");

  // Filter logic
  const filteredListings = listings.filter((item) => {
    if (activeTab === "All") return true;
    return item.status === activeTab;
  });

  // Actions
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      setListings((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleMarkSold = (id) => {
    if (window.confirm("Mark this item as Sold? It will no longer be visible to buyers.")) {
      setListings((prev) => 
        prev.map((item) => item.id === id ? { ...item, status: "Sold" } : item)
      );
    }
  };

  return (
    <>
      <Navbar />
      <main className={styles.page}>
        <div className={styles.container}>
          
          {/* Header */}
          <div className={styles.header}>
            <div>
              <h1>My Listings</h1>
              <p>Manage the items you are selling on BazaarNext</p>
            </div>
            <Link to="/sell" className={styles.addBtn}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Sell New Item
            </Link>
          </div>

          {/* Tabs */}
          <div className={styles.tabsWrap}>
            {TABS.map(tab => (
              <button
                key={tab}
                className={`${styles.tabBtn} ${activeTab === tab ? styles.activeTab : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Grid */}
          {filteredListings.length > 0 ? (
            <div className={styles.grid}>
              {filteredListings.map((item) => (
                <ListingCard 
                  key={item.id} 
                  listing={item} 
                  onDelete={() => handleDelete(item.id)}
                  onMarkSold={() => handleMarkSold(item.id)}
                />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
              </div>
              <h2>No {activeTab !== "All" ? activeTab.toLowerCase() : ""} listings found</h2>
              <p>You haven't added any items to this section yet.</p>
              <Link to="/sell" className={styles.emptyShopBtn}>Start Selling</Link>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}