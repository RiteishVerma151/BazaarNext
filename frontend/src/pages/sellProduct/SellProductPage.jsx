import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/commoncomponents/Navbar.jsx";
import Footer from "../../components/commoncomponents/Footer.jsx";
import ImageUploader from "../../components/sellProduct/ImageUploader.jsx";
import api from "../../lib/axios.js";
import styles from "../../styles/sellProduct/SellProductPage.module.css";

const CATEGORIES = [
  "Electronics",
  "Fashion",
  "Books",
  "Furniture",
  "Home Appliances",
  "Sports",
  "Vehicles",
  "Other",
];

const CONDITIONS = ["Like New", "Good", "Fair"];

const getImageUrl = (path) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;

  const baseURL = api.defaults.baseURL || "https://bazaarnext.onrender.com/api";
  const serverURL = baseURL.replace(/\/api\/?$/, "");

  return `${serverURL}${path.startsWith("/") ? "" : "/"}${path}`;
};

const getErrorMessage = (error) => {
  const data = error.response?.data;

  if (Array.isArray(data?.errors) && data.errors.length) {
    return data.errors.join(". ");
  }

  return (
    data?.message ||
    data?.error ||
    error.message ||
    "Something went wrong. Please try again."
  );
};

export default function SellProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    title: "",
    category: "Electronics",
    condition: "Good",
    price: "",
    description: "",
    images: [],
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  // Load the existing product in edit mode.
  useEffect(() => {
    if (!isEdit) return;

    let cancelled = false;

    const loadProduct = async () => {
      try {
        setLoadingProduct(true);
        setApiError("");

        const response = await api.get(`/products/${id}`);
        const product = response.data?.product;

        if (!product) {
          throw new Error("Product details could not be loaded.");
        }

        if (cancelled) return;

        setForm({
          title: product.title ?? "",
          category: product.category ?? "Electronics",
          condition: product.condition ?? "Good",
          price: String(product.price ?? ""),
          description: product.description ?? "",
          images: (product.images ?? []).map((path, index) => ({
            id: `existing-${index}-${path}`,
            preview: getImageUrl(path),
            existingPath: path,
          })),
        });
      } catch (error) {
        if (!cancelled) {
          setApiError(getErrorMessage(error));
        }
      } finally {
        if (!cancelled) setLoadingProduct(false);
      }
    };

    loadProduct();

    return () => {
      cancelled = true;
    };
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (apiError) setApiError("");
  };

  const handleImagesChange = (nextImages) => {
    // The current backend replaces all images when new files are uploaded.
    // In edit mode, selecting new files therefore starts a new image set.
    const hasNewFiles = nextImages.some((image) => image.file);

    setForm((prev) => ({
      ...prev,
      images:
        isEdit && hasNewFiles
          ? nextImages.filter((image) => image.file)
          : nextImages,
    }));

    if (errors.images) {
      setErrors((prev) => ({ ...prev, images: "" }));
    }

    if (apiError) setApiError("");
  };

  const validate = () => {
    const nextErrors = {};

    if (form.title.trim().length < 3) {
      nextErrors.title = "Title must be at least 3 characters";
    } else if (form.title.trim().length > 100) {
      nextErrors.title = "Title cannot exceed 100 characters";
    }

    if (
      !form.price ||
      !Number.isFinite(Number(form.price)) ||
      Number(form.price) < 1
    ) {
      nextErrors.price = "Enter a valid price of at least ₹1";
    }

    if (form.description.trim().length < 10) {
      nextErrors.description = "Description must be at least 10 characters";
    } else if (form.description.trim().length > 3000) {
      nextErrors.description = "Description cannot exceed 3000 characters";
    }

    if (!CATEGORIES.includes(form.category)) {
      nextErrors.category = "Select a valid category";
    }

    if (!CONDITIONS.includes(form.condition)) {
      nextErrors.condition = "Select a valid condition";
    }

    if (form.images.length === 0) {
      nextErrors.images = "Add at least one photo";
    }

    if (form.images.length > 5) {
      nextErrors.images = "You can add a maximum of 5 photos";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting || loadingProduct) return;
    if (!validate()) return;

    setSubmitting(true);
    setApiError("");

    try {
      const formData = new FormData();

      formData.append("title", form.title.trim());
      formData.append("description", form.description.trim());
      formData.append("price", String(Number(form.price)));
      formData.append("category", form.category);
      formData.append("condition", form.condition);

      const newFiles = form.images.filter((image) => image.file);

      if (newFiles.length > 0) {
        newFiles.forEach((image) => {
          formData.append("images", image.file);
        });
      } else if (isEdit) {
        const existingPaths = form.images
          .filter((image) => image.existingPath)
          .map((image) => image.existingPath);

        formData.append("images", JSON.stringify(existingPaths));
      } else if (isEdit) {
        // No new files: preserve the existing server image paths.
        const existingPaths = form.images
          .filter((image) => image.existingPath)
          .map((image) => image.existingPath);

        formData.append("images", JSON.stringify(existingPaths));
      }

      if (isEdit) {
        await api.put(`/products/${id}`, formData);
      } else {
        await api.post("/products", formData);
      }

      setSubmitted(true);

      // Refresh shared product data if the provider is available.
      window.setTimeout(() => {
        navigate("/my-listings", { replace: true });
      }, 1800);
    } catch (error) {
      setApiError(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingProduct) {
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

  if (submitted) {
    return (
      <>
        <Navbar />
        <main className={styles.page}>
          <div className={styles.successCard}>
            <div className={styles.successIcon}>
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <h1>{isEdit ? "Listing Updated!" : "Listing Published!"}</h1>
            <p>
              Your item <strong>{form.title}</strong> has been{" "}
              {isEdit ? "updated" : "published"} successfully.
            </p>
            <p className={styles.redirectText}>
              Redirecting to your listings...
            </p>
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

          {apiError && (
            <div role="alert" className={styles.error}>
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.formLayout}>
            <div className={styles.mainCol}>
              <section className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h2>Photos</h2>
                  <span className={styles.hint}>
                    Add up to 5 photos. First one will be the cover.
                  </span>
                </div>

                <ImageUploader
                  images={form.images}
                  onChange={handleImagesChange}
                />

                {isEdit && (
                  <p className={styles.hint}>
                    To replace the existing photos, select the new photos.
                  </p>
                )}

                {errors.images && (
                  <span className={styles.error}>{errors.images}</span>
                )}
              </section>

              <section className={styles.section}>
                <h2>Product Details</h2>

                <div className={styles.inputGroup}>
                  <label htmlFor="title">Product Title *</label>
                  <input
                    id="title"
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g. Gaming laptop, School backpack..."
                    maxLength={100}
                  />
                  <span className={styles.charCount}>
                    {form.title.length}/100
                  </span>
                  {errors.title && (
                    <span className={styles.error}>{errors.title}</span>
                  )}
                </div>

                <div className={styles.row}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="category">Category *</label>
                    <select
                      id="category"
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                    >
                      {CATEGORIES.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <span className={styles.error}>{errors.category}</span>
                    )}
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="condition">Condition *</label>
                    <select
                      id="condition"
                      name="condition"
                      value={form.condition}
                      onChange={handleChange}
                    >
                      {CONDITIONS.map((condition) => (
                        <option key={condition} value={condition}>
                          {condition}
                        </option>
                      ))}
                    </select>
                    {errors.condition && (
                      <span className={styles.error}>{errors.condition}</span>
                    )}
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="description">Description *</label>
                  <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe your item, its usage, defects, and reason for selling..."
                    rows={5}
                    maxLength={3000}
                  />
                  <span className={styles.charCount}>
                    {form.description.length}/3000
                  </span>
                  {errors.description && (
                    <span className={styles.error}>{errors.description}</span>
                  )}
                </div>
              </section>

              <section className={styles.section}>
                <h2>Pricing</h2>

                <div className={styles.inputGroup}>
                  <label htmlFor="price">Asking Price *</label>
                  <div className={styles.priceInput}>
                    <span className={styles.currency}>₹</span>
                    <input
                      id="price"
                      type="number"
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      placeholder="0"
                      min="1"
                      step="1"
                    />
                  </div>
                  {errors.price && (
                    <span className={styles.error}>{errors.price}</span>
                  )}
                </div>
              </section>
            </div>

            <div className={styles.sideCol}>
              <div className={styles.previewCard}>
                <h3>Live Preview</h3>

                <div className={styles.previewImage}>
                  {form.images[0] ? (
                    <img src={form.images[0].preview} alt="Product preview" />
                  ) : (
                    <div className={styles.previewPlaceholder}>
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="M21 15l-5-5L5 21" />
                      </svg>
                      No image yet
                    </div>
                  )}

                  <span className={styles.previewCondition}>
                    {form.condition}
                  </span>
                </div>

                <div className={styles.previewBody}>
                  <span className={styles.previewCategory}>
                    {form.category}
                  </span>
                  <h4 className={styles.previewTitle}>
                    {form.title || "Product title"}
                  </h4>
                  <div className={styles.previewFooter}>
                    <span className={styles.previewPrice}>
                      ₹
                      {form.price
                        ? Number(form.price).toLocaleString("en-IN")
                        : "0"}
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.submitBox}>
                <button
                  type="submit"
                  className={styles.publishBtn}
                  disabled={submitting || loadingProduct}
                >
                  {submitting
                    ? "Saving..."
                    : isEdit
                      ? "Update Listing"
                      : "Publish Listing"}
                </button>

                <p className={styles.tip}>
                  💡 Clear photos and honest descriptions help buyers trust your
                  listing.
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
