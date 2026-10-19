import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/commoncomponents/Navbar.jsx";
import Footer from "../../components/commoncomponents/Footer.jsx";
import ImageUploader from "../../components/sellProduct/ImageUploader.jsx";
import styles from "../../styles/sellProduct/SellProductPage.module.css";

const CATEGORIES = ["Bags", "Cycles", "Furniture", "Daily essentials", "Electronics", "Books & notes", "Fashion"];
const CONDITIONS = ["Like new", "Good", "Fair"];
const LOCATIONS = ["Ulhasnagar 1", "Ulhasnagar 2", "Ulhasnagar 3", "Ulhasnagar 4", "Ulhasnagar 5"];

export default function SellProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id); // /sell/:id pe edit mode

  const [form, setForm] = useState({
    title: "",
    category: "Bags",
    condition: "Good",
    price: "",
    negotiable: false,
    description: "",
    location: "Ulhasnagar 1",
    images: [],
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Product title is required";
    if (!form.price || Number(form.price) <= 0) errs.price = "Enter a valid price";
    if (!form.description.trim()) errs.description = "Description is required";
    if (form.images.length === 0) errs.images = "Add at least one photo";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    // TODO: POST /api/products (FormData)
    setSubmitted(true);
    setTimeout(() => navigate("/my-orders"), 2200);
  };

  const handleDraft = () => {
    // TODO: Save draft API
    alert("Saved as draft (API pending)");
  };

  if (submitted) {
    return (
      <>
        <Navbar />
        <main className={styles.page}>
          <div className={styles.successCard}>
            <div className={styles.successIcon}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h1>{isEdit ? "Listing Updated!" : "Listing Published!"}</h1>
            <p>Your item <strong>{form.title}</strong> is now live on BazaarNext.</p>
            <p className={styles.redirectText}>Redirecting to your listings...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1>{isEdit ? "Edit Listing" : "Sell an Item"}</h1>
            <p>List your used item in a few minutes. It's free!</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.formLayout}>
            {/* Left Column — Form */}
            <div className={styles.mainCol}>

              {/* Photos */}
              <section className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h2>Photos</h2>
                  <span className={styles.hint}>Add up to 5 photos. First one will be the cover.</span>
                </div>
                <ImageUploader
                  images={form.images}
                  onChange={(imgs) => setForm(prev => ({ ...prev, images: imgs }))}
                />
                {errors.images && <span className={styles.error}>{errors.images}</span>}
              </section>

              {/* Basic Info */}
              <section className={styles.section}>
                <h2>Product Details</h2>

                <div className={styles.inputGroup}>
                  <label>Product Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g. Hero cycle, School backpack…"
                    maxLength={80}
                  />
                  <span className={styles.charCount}>{form.title.length}/80</span>
                  {errors.title && <span className={styles.error}>{errors.title}</span>}
                </div>

                <div className={styles.row}>
                  <div className={styles.inputGroup}>
                    <label>Category *</label>
                    <select name="category" value={form.category} onChange={handleChange}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Condition *</label>
                    <select name="condition" value={form.condition} onChange={handleChange}>
                      {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label>Description *</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe your item: how long you've used it, any defects, reason for selling…"
                    rows={5}
                    maxLength={500}
                  />
                  <span className={styles.charCount}>{form.description.length}/500</span>
                  {errors.description && <span className={styles.error}>{errors.description}</span>}
                </div>
              </section>

              {/* Pricing */}
              <section className={styles.section}>
                <h2>Pricing</h2>
                <div className={styles.inputGroup}>
                  <label>Asking Price *</label>
                  <div className={styles.priceInput}>
                    <span className={styles.currency}>₹</span>
                    <input
                      type="number"
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  {errors.price && <span className={styles.error}>{errors.price}</span>}
                </div>

                <label className={styles.checkRow}>
                  <input
                    type="checkbox"
                    name="negotiable"
                    checked={form.negotiable}
                    onChange={handleChange}
                  />
                  <span>Price is negotiable</span>
                </label>
              </section>

              {/* Location */}
              <section className={styles.section}>
                <h2>Location</h2>
                <div className={styles.inputGroup}>
                  <label>Your Area *</label>
                  <select name="location" value={form.location} onChange={handleChange}>
                    {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </section>

            </div>

            {/* Right Column — Preview + Submit */}
            <div className={styles.sideCol}>
              <div className={styles.previewCard}>
                <h3>Live Preview</h3>
                <div className={styles.previewImage}>
                  {form.images[0] ? (
                    <img src={form.images[0].preview} alt="preview" />
                  ) : (
                    <div className={styles.previewPlaceholder}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="M21 15l-5-5L5 21" />
                      </svg>
                      No image yet
                    </div>
                  )}
                  <span className={styles.previewCondition}>{form.condition}</span>
                </div>
                <div className={styles.previewBody}>
                  <span className={styles.previewCategory}>{form.category}</span>
                  <h4 className={styles.previewTitle}>{form.title || "Product title"}</h4>
                  <div className={styles.previewFooter}>
                    <span className={styles.previewPrice}>
                      ₹{form.price ? Number(form.price).toLocaleString("en-IN") : "0"}
                    </span>
                    {form.negotiable && <span className={styles.previewNeg}>Negotiable</span>}
                  </div>
                  <p className={styles.previewLocation}>📍 {form.location}</p>
                </div>
              </div>

              <div className={styles.submitBox}>
                <button type="submit" className={styles.publishBtn}>
                  {isEdit ? "Update Listing" : "Publish Listing"}
                </button>
                <button type="button" className={styles.draftBtn} onClick={handleDraft}>
                  Save as Draft
                </button>
                <p className={styles.tip}>
                  💡 Listings with clear photos and honest descriptions sell 3x faster.
                </p>
              </div>
            </div>

          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}