import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import styles from "../../styles/commonComponent/Navbar.module.css";


export default function Navbar() {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

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

          <NavLink to="/sell" onClick={close}>
            Sell an Item
          </NavLink>

          <NavLink to="/wishlist" onClick={close}>
            Wishlist
          </NavLink>

          <NavLink to="/my-orders" onClick={close}>
            My Orders
          </NavLink>

          <Link
            to="/register"
            className={`btn btn-dark ${styles.navLogin}`}
            onClick={close}
          >
            Sign In / Sign Up
          </Link>
        </nav>

        <button
          type="button"
          className={styles.menuBtn}
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}