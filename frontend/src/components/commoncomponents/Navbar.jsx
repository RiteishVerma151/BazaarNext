import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  UserRound,
  Package,
  Heart,
  ShoppingBag,
  Store,
  FileText,
  Send,
  Inbox,
  LayoutDashboard,
  UserCircle,
  LogOut,
  Home,
} from "lucide-react";

import { useApp } from "../../context/AppContext.jsx";
import styles from "../../styles/commoncomponent/Navbar.module.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { currentUser, isAuthenticated, logout } = useApp();
  const navigate = useNavigate();

  const closeMenu = () => setOpen(false);

  const userName =
    currentUser?.name ||
    currentUser?.username ||
    currentUser?.email?.split("@")[0] ||
    "User";

  const firstLetter = userName.charAt(0).toUpperCase();

  const isAdmin = currentUser?.role?.toLowerCase() === "admin";

  const menuItems = [
    { label: "My Profile", path: "/profile", icon: UserCircle },
    { label: "My Orders", path: "/my-orders", icon: Package },
    { label: "Wishlist", path: "/wishlist", icon: Heart },
    { label: "My Listings", path: "/my-listings", icon: Store },
    { label: "Sell an Item", path: "/sell", icon: ShoppingBag },
    { label: "Sellers Dashboard", path: "/seller/dashboard", icon: FileText },
    { label: "Offers Sent", path: "/my-offers", icon: Send },
    { label: "Offers Received", path: "/offers", icon: Inbox },
    ...(isAdmin
      ? [
          {
            label: "Admin Dashboard",
            path: "/admin/dashboard",
            icon: LayoutDashboard,
          },
        ]
      : []),
  ];

  const handleLogout = async () => {
    closeMenu();
    await logout();
    navigate("/");
  };

  return (
    <header className={styles.navbar}>
      <div className={styles.navbarInner}>
        <Link to="/" className={styles.logo} onClick={closeMenu}>
          <span className={styles.logoIcon}>
            <ShoppingBag size={22} />
          </span>
          <span>
            Bazaar<span className={styles.logoAccent}>Next</span>
          </span>
        </Link>

        <nav className={styles.mainLinks}>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? styles.activeLink : styles.navLink
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/products"
            className={({ isActive }) =>
              isActive ? styles.activeLink : styles.navLink
            }
          >
            Shop
          </NavLink>
        </nav>

        <div className={styles.rightSection}>
          {isAuthenticated && currentUser ? (
            <Link to="/profile" className={styles.userInfo}>
              <span className={styles.avatar}>{firstLetter}</span>
              <span className={styles.userName}>{userName}</span>
            </Link>
          ) : (
            <Link to="/login" className={styles.signIn} onClick={closeMenu}>
              Sign In
            </Link>
          )}

          <button
            type="button"
            className={`${styles.menuButton} ${
              open ? styles.menuButtonActive : ""
            }`}
            onClick={() => setOpen((previous) => !previous)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X size={25} /> : <Menu size={27} />}
          </button>
        </div>
      </div>

      {open && (
        <>
          <button
            type="button"
            className={styles.menuOverlay}
            onClick={closeMenu}
            aria-label="Close menu"
          />

          <div className={styles.dropdown}>
            {isAuthenticated && currentUser && (
              <div className={styles.dropdownHeader}>
                <span className={styles.avatarLarge}>{firstLetter}</span>
                <div className={styles.userDetails}>
                  <p className={styles.dropdownName}>{userName}</p>
                  <p className={styles.dropdownEmail}>{currentUser.email}</p>
                </div>
              </div>
            )}

            <p className={styles.menuLabel}>MENU</p>

            <div className={styles.menuLinks}>
              <NavLink
                to="/"
                end
                onClick={closeMenu}
                className={({ isActive }) =>
                  `${styles.menuLink} ${
                    isActive ? styles.menuLinkActive : ""
                  }`
                }
              >
                <Home size={19} />
                <span>Home</span>
              </NavLink>

              <NavLink
                to="/products"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `${styles.menuLink} ${
                    isActive ? styles.menuLinkActive : ""
                  }`
                }
              >
                <ShoppingBag size={19} />
                <span>Shop</span>
              </NavLink>

              {isAuthenticated ? (
                <>
                  {menuItems.map(({ label, path, icon: Icon }) => (
                    <NavLink
                      key={path}
                      to={path}
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        `${styles.menuLink} ${
                          isActive ? styles.menuLinkActive : ""
                        }`
                      }
                    >
                      <Icon size={19} />
                      <span>{label}</span>
                    </NavLink>
                  ))}

                  <div className={styles.menuDivider} />

                  <button
                    type="button"
                    className={styles.logoutButton}
                    onClick={handleLogout}
                  >
                    <LogOut size={19} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <div className={styles.menuDivider} />
                  <Link
                    to="/login"
                    className={styles.menuLink}
                    onClick={closeMenu}
                  >
                    <UserRound size={19} />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    to="/register"
                    className={styles.createAccount}
                    onClick={closeMenu}
                  >
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
}