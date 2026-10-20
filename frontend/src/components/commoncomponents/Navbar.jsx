import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext.jsx";
import styles from "../../styles/commonComponent/Navbar.module.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { currentUser, isAuthenticated, logout } = useApp();
  const navigate = useNavigate();

  const close = () => setOpen(false);

  const handleLogout = () => {
    logout();
    close();
    navigate("/");
  };

  const userName =
    currentUser?.name ||
    currentUser?.username ||
    currentUser?.email?.split("@")[0] ||
    "Account";

  return (
    <header className={styles.navbar}>
      <div className={`wrap ${styles.navbarRow}`}>
        <Link to="/" className={styles.logo} onClick={close}>
          Bazaar<span>Next</span>
        </Link>

        <nav
          className={`${styles.navLinks} ${open ? styles.open : ""}`}
          aria-label="Main navigation"
        >
          <NavLink to="/" end onClick={close}>
            Home
          </NavLink>

          <NavLink to="/products" onClick={close}>
            Shop
          </NavLink>

          {isAuthenticated && (
            <>
              <NavLink to="/sell" onClick={close}>
                Sell an Item
              </NavLink>

              <NavLink to="/wishlist" onClick={close}>
                Wishlist
              </NavLink>

              <NavLink to="/my-orders" onClick={close}>
                My Orders
              </NavLink>

              <NavLink to="/profile" onClick={close}>
                {userName}
              </NavLink>

              <button
                type="button"
                className={`btn btn-dark ${styles.navLogin}`}
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}

          {!isAuthenticated && (
            <Link
              to="/register"
              className={`btn btn-dark ${styles.navLogin}`}
              onClick={close}
            >
              Sign In / Sign Up
            </Link>
          )}
        </nav>

        <button
          type="button"
          className={styles.menuBtn}
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}