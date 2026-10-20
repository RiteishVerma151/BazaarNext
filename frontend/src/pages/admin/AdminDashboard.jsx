
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Home } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Wallet,
  Search,
  RefreshCw,
  Menu,
  X,
  ShieldCheck,
  Ban,
  CheckCircle2,
  Trash2,
  ChevronRight,
  Store,
  LoaderCircle,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/admin/admin.module.css";

const API_URL = "https://bazaarnext.onrender.com/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const EMPTY_STATS = {
  totalUsers: 0,
  totalProducts: 0,
  totalOrders: 0,
  totalRevenue: 0,
};

const getId = (item) => item?._id || item?.id;

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
};

const getSeller = (product) => {
  const seller = product?.seller;

  if (seller && typeof seller === "object") {
    return seller.name || seller.email || "Unknown seller";
  }

  return "Seller";
};

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message ||
  error?.message ||
  fallback;

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState(EMPTY_STATS);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState("");
  const navigate = useNavigate();

  const fetchDashboard = useCallback(async () => {
    setLoading(true);

    try {
      const results = await Promise.allSettled([
        api.get("/admin/stats"),
        api.get("/admin/users"),
        api.get("/admin/products"),
      ]);

      const [statsResult, usersResult, productsResult] = results;

      if (statsResult.status === "fulfilled") {
        const data = statsResult.value.data;

        if (data.success && data.stats) {
          setStats(data.stats);
        } else {
          toast.error(data.message || "Failed to load statistics");
        }
      } else {
        toast.error(
          getErrorMessage(
            statsResult.reason,
            "Failed to load statistics"
          )
        );
      }

      if (usersResult.status === "fulfilled") {
        const data = usersResult.value.data;

        if (data.success && Array.isArray(data.users)) {
          setUsers(data.users);
        } else {
          toast.error(data.message || "Failed to load users");
        }
      } else {
        toast.error(
          getErrorMessage(usersResult.reason, "Failed to load users")
        );
      }

      if (productsResult.status === "fulfilled") {
        const data = productsResult.value.data;

        if (data.success && Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          toast.error(data.message || "Failed to load products");
        }
      } else {
        toast.error(
          getErrorMessage(
            productsResult.reason,
            "Failed to load products"
          )
        );
      }
    } catch (error) {
      console.error("DASHBOARD ERROR:", error);
      toast.error(
        getErrorMessage(error, "Unable to load dashboard data")
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const role = String(user.role || "").toLowerCase().trim();

      if (role === "admin") return false;

      if (!query) return true;

      return [user.name, user.email, user.role]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(query)
        );
    });
  }, [users, search]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return products;

    return products.filter((product) =>
      [
        product.name,
        product.title,
        product.category,
        product.status,
        getSeller(product),
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [products, search]);

  const handleToggleBlock = async (user) => {
    const id = getId(user);

    if (!id || actionId) return;

    if (String(user.role || "").toLowerCase().trim() === "admin") {
      toast.error("Admin account cannot be blocked");
      return;
    }

    const currentlyBlocked = Boolean(user.isBlocked ?? user.blocked);
    const action = currentlyBlocked ? "unblock" : "block";

    setActionId(`user-${id}`);

    try {
      const { data } = await api.patch(`/admin/users/${id}/block`);

      if (!data.success) {
        throw new Error(data.message || `Failed to ${action} user`);
      }

      setUsers((currentUsers) =>
        currentUsers.map((item) => {
          if (String(getId(item)) !== String(id)) return item;

          if (data.user) {
            return { ...item, ...data.user };
          }

          return {
            ...item,
            isBlocked: !currentlyBlocked,
            blocked: !currentlyBlocked,
          };
        })
      );

      toast.success(
        data.message ||
          `User ${action === "block" ? "blocked" : "unblocked"} successfully`
      );
    } catch (error) {
      console.error("BLOCK / UNBLOCK ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          `Failed to ${action} user`
      );
    } finally {
      setActionId("");
    }
  };

  const handleRemoveProduct = async (product) => {
    const id = getId(product);

    if (!id || actionId || product.status === "REMOVED") return;

    const name = product.name || product.title || "this product";

    const confirmed = window.confirm(
      `Remove "${name}" from listings?`
    );

    if (!confirmed) return;

    setActionId(`product-${id}`);

    try {
      const { data } = await api.delete(`/admin/products/${id}`);

      if (!data.success) {
        throw new Error(data.message || "Unable to remove product");
      }

      setProducts((currentProducts) =>
        currentProducts.map((item) =>
          String(getId(item)) === String(id)
            ? { ...item, status: "REMOVED" }
            : item
        )
      );

      toast.success(data.message || "Product removed successfully");
    } catch (error) {
      console.error("REMOVE PRODUCT ERROR:", error);
      toast.error(
        getErrorMessage(error, "Unable to remove product")
      );
    } finally {
      setActionId("");
    }
  };

  const goTo = (tab) => {
    setActiveTab(tab);
    setSearch("");
    setMenuOpen(false);
  };

  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "users", label: "Manage Users", icon: Users },
    { id: "products", label: "Manage Products", icon: Package },
  ];

  const statCards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "purple",
    },
    {
      label: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      color: "green",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: "orange",
    },
    {
      label: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      icon: Wallet,
      color: "blue",
    },
  ];

  const renderUsers = (list) => (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>User</th>
            <th>Role</th>
            <th>Joined</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {list.map((user) => {
            const id = getId(user);
            const busy = actionId === `user-${id}`;
            const isAdmin =
              String(user.role || "").toLowerCase().trim() === "admin";
            const isBlocked = Boolean(user.isBlocked ?? user.blocked);

            return (
              <tr key={id || user.email}>
                <td>
                  <div className={styles.personCell}>
                    <div className={styles.avatar}>
                      {(user.name || user.email || "U")
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className={styles.personInfo}>
                      <strong>{user.name || "Unnamed user"}</strong>
                      <span>{user.email || "—"}</span>
                    </div>
                  </div>
                </td>

                <td>
                  <span className={styles.roleBadge}>
                    {user.role || "user"}
                  </span>
                </td>

                <td>{formatDate(user.createdAt)}</td>

                <td>
                  <span
                    className={`${styles.statusBadge} ${
                      isBlocked
                        ? styles.statusBlocked
                        : styles.statusActive
                    }`}
                  >
                    <span className={styles.statusDot} />
                    {isBlocked ? "Blocked" : "Active"}
                  </span>
                </td>

                <td>
                  <button
                    type="button"
                    className={`${styles.actionButton} ${
                      isBlocked
                        ? styles.unblockButton
                        : styles.blockButton
                    }`}
                    disabled={Boolean(actionId) || !id || isAdmin}
                    onClick={() => handleToggleBlock(user)}
                    title={
                      isAdmin
                        ? "Admin accounts cannot be blocked here"
                        : isBlocked
                          ? "Unblock user"
                          : "Block user"
                    }
                  >
                    {busy ? (
                      <LoaderCircle
                        size={15}
                        className={styles.spin}
                      />
                    ) : isBlocked ? (
                      <CheckCircle2 size={15} />
                    ) : (
                      <Ban size={15} />
                    )}

                    {isAdmin
                      ? "Admin"
                      : isBlocked
                        ? "Unblock"
                        : "Block"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {list.length === 0 && (
        <div className={styles.emptyState}>
          <Users size={28} />
          <strong>No users found</strong>
          <span>
            Try changing your search or register a user first.
          </span>
        </div>
      )}
    </div>
  );

  const renderProducts = (list) => (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Product</th>
            <th>Seller</th>
            <th>Price</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {list.map((product) => {
            const id = getId(product);
            const removed = product.status === "REMOVED";
            const busy = actionId === `product-${id}`;

            return (
              <tr key={id || product.title}>
                <td>
                  <div className={styles.productCell}>
                    <div className={styles.productIcon}>
                      <Package size={20} />
                    </div>

                    <div className={styles.personInfo}>
                      <strong>
                        {product.name ||
                          product.title ||
                          "Untitled product"}
                      </strong>
                      <span>{product.category || "—"}</span>
                    </div>
                  </div>
                </td>

                <td>{getSeller(product)}</td>

                <td className={styles.priceCell}>
                  {formatCurrency(product.price)}
                </td>

                <td>
                  <span
                    className={`${styles.statusBadge} ${
                      removed
                        ? styles.statusBlocked
                        : styles.statusActive
                    }`}
                  >
                    <span className={styles.statusDot} />
                    {product.status || "Active"}
                  </span>
                </td>

                <td>
                  <button
                    type="button"
                    className={`${styles.actionButton} ${styles.blockButton}`}
                    disabled={Boolean(actionId) || removed || !id}
                    onClick={() => handleRemoveProduct(product)}
                  >
                    {busy ? (
                      <LoaderCircle
                        size={15}
                        className={styles.spin}
                      />
                    ) : (
                      <Trash2 size={15} />
                    )}

                    {removed ? "Removed" : "Remove"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {list.length === 0 && (
        <div className={styles.emptyState}>
          <Package size={28} />
          <strong>No products found</strong>
          <span>
            Try changing your search or add a product first.
          </span>
        </div>
      )}
    </div>
  );

  return (
    <div className={styles.dashboard}>
      {menuOpen && (
        <button
          type="button"
          className={styles.mobileOverlay}
          aria-label="Close sidebar"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <aside
        className={`${styles.sidebar} ${
          menuOpen ? styles.sidebarOpen : ""
        }`}
      >
        <div className={styles.brand}>
          <div className={styles.brandIcon}>
            <Store size={23} />
          </div>

          <div>
            <h2>BazaarNext</h2>
            <span>ADMIN PANEL</span>
          </div>

          <button
            type="button"
            className={styles.closeMenu}
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className={styles.navLabel}>WORKSPACE</div>

        <nav className={styles.navigation}>
          <button
  type="button"
  className={styles.navItem}
  onClick={() => navigate("/")}
>
  <Home size={19} />
  <span>Home</span>
</button>
          
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              type="button"
              key={id}
              className={`${styles.navItem} ${
                activeTab === id ? styles.navActive : ""
              }`}
              onClick={() => goTo(id)}
            >
              <Icon size={19} />
              <span>{label}</span>

              {activeTab === id && (
                <ChevronRight
                  size={16}
                  className={styles.navArrow}
                />
              )}
            </button>
          ))}
        </nav>

        <div className={styles.sidebarBottom}>
          <div className={styles.securityCard}>
            <ShieldCheck size={25} />
            <strong>Secure workspace</strong>
            <span>Protected admin operations</span>
          </div>

          <div className={styles.adminProfile}>
            <div className={styles.profileAvatar}>A</div>

            <div className={styles.personInfo}>
              <strong>Administrator</strong>
              <span>Admin dashboard</span>
            </div>

            <ShieldCheck
              size={17}
              className={styles.profileShield}
            />
          </div>
        </div>
      </aside>

      <main className={styles.main}>
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <button
              type="button"
              className={styles.menuButton}
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={22} />
            </button>

            <div className={styles.breadcrumb}>
              <span>Admin</span>
              <ChevronRight size={15} />
              <strong>
                {navItems.find((item) => item.id === activeTab)?.label}
              </strong>
            </div>
          </div>

          <div className={styles.topbarRight}>
            <button
              type="button"
              className={styles.iconButton}
              title="Refresh dashboard"
              aria-label="Refresh dashboard"
              disabled={loading || Boolean(actionId)}
              onClick={fetchDashboard}
            >
              <RefreshCw
                size={18}
                className={loading ? styles.spin : ""}
              />
            </button>

            <div className={styles.topbarDivider} />

            <div className={styles.topbarAdmin}>
              <div className={styles.profileAvatar}>A</div>

              <div className={styles.personInfo}>
                <strong>Admin</strong>
                <span>Administrator</span>
              </div>
            </div>
          </div>
        </header>

        <div className={styles.content}>
          <section className={styles.welcomeRow}>
            <div>
              <div className={styles.eyebrow}>
                <span className={styles.liveDot} />
                BAZAARNEXT CONTROL CENTER
              </div>

              <h1>
                {activeTab === "overview"
                  ? "Dashboard overview"
                  : activeTab === "users"
                    ? "Manage users"
                    : "Manage products"}
              </h1>

              <p>
                {activeTab === "overview"
                  ? "Monitor your marketplace and manage everything in one place."
                  : activeTab === "users"
                    ? "View registered accounts and manage user access."
                    : "Review product listings and moderate your marketplace."}
              </p>
            </div>

            <div className={styles.welcomeActions}>
              <div className={styles.todayBadge}>
                <span>Today</span>
                <strong>
                  {new Date().toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </strong>
              </div>
            </div>
          </section>

          {loading ? (
            <div className={styles.loadingState}>
              <LoaderCircle
                size={30}
                className={styles.spin}
              />
              <strong>Loading dashboard...</strong>
              <span>Fetching users, products and statistics.</span>
            </div>
          ) : (
            <>
              {activeTab === "overview" && (
                <>
                  <section className={styles.statsGrid}>
                    {statCards.map(
                      ({ label, value, icon: Icon, color }) => (
                        <article
                          className={styles.statCard}
                          key={label}
                        >
                          <div className={styles.statTop}>
                            <div
                              className={`${styles.statIcon} ${styles[color]}`}
                            >
                              <Icon size={21} />
                            </div>

                            <span className={styles.statMore}>
                              Database
                            </span>
                          </div>

                          <div className={styles.statValue}>
                            {value}
                          </div>
                          <div className={styles.statLabel}>
                            {label}
                          </div>
                        </article>
                      )
                    )}
                  </section>

                  <section className={styles.overviewGrid}>
                    <article className={styles.panel}>
                      <div className={styles.panelHeader}>
                        <div>
                          <h2>Recent users</h2>
                          <p>
                            {filteredUsers.length} registered accounts
                          </p>
                        </div>

                        <button
                          type="button"
                          className={styles.textButton}
                          onClick={() => goTo("users")}
                        >
                          View all <ChevronRight size={15} />
                        </button>
                      </div>

                      {renderUsers(filteredUsers.slice(0, 5))}
                    </article>

                    <article className={styles.panel}>
                      <div className={styles.panelHeader}>
                        <div>
                          <h2>Recent products</h2>
                          <p>
                            {products.length} product records
                          </p>
                        </div>

                        <button
                          type="button"
                          className={styles.textButton}
                          onClick={() => goTo("products")}
                        >
                          View all <ChevronRight size={15} />
                        </button>
                      </div>

                      {renderProducts(products.slice(0, 5))}
                    </article>
                  </section>
                </>
              )}

              {activeTab === "users" && (
                <section className={styles.panel}>
                  <div className={styles.panelHeader}>
                    <div>
                      <h2>Manage Users</h2>
                      <p>
                        {filteredUsers.length} registered accounts
                      </p>
                    </div>

                    <div className={styles.tableSearch}>
                      <Search size={17} />
                      <input
                        type="search"
                        value={search}
                        onChange={(event) =>
                          setSearch(event.target.value)
                        }
                        placeholder="Search name, email or role..."
                        aria-label="Search users"
                      />
                    </div>
                  </div>

                  {renderUsers(filteredUsers)}
                </section>
              )}

              {activeTab === "products" && (
                <section className={styles.panel}>
                  <div className={styles.panelHeader}>
                    <div>
                      <h2>Manage Products</h2>
                      <p>
                        {products.length} product records
                      </p>
                    </div>

                    <div className={styles.tableSearch}>
                      <Search size={17} />
                      <input
                        type="search"
                        value={search}
                        onChange={(event) =>
                          setSearch(event.target.value)
                        }
                        placeholder="Search product or seller..."
                        aria-label="Search products"
                      />
                    </div>
                  </div>

                  {renderProducts(filteredProducts)}
                </section>
              )}
            </>
          )}

          <footer className={styles.footer}>
            <span>© {new Date().getFullYear()} BazaarNext</span>

            <span>
              <span className={styles.footerDot} />
              Admin workspace
            </span>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;