import { useState } from "react";
import "../styles/Navbar.css";

const links = [
  { label: "Browse", href: "#products" },
  { label: "Wishlist", href: "#" },
  { label: "My orders", href: "#" },
  { label: "Sell an item", href: "#" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="wrap navbar-row">
        <a href="#" className="logo">Bazaar<span>Next</span></a>

        <nav className={`nav-links ${open ? "open" : ""}`} aria-label="Main">
          {links.map((l) => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
          ))}
          <a href="#" className="btn btn-dark nav-login">Sign in / Sign up</a>
        </nav>

        <button
          className="menu-btn"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span /><span /><span />
        </button>
      </div>
    </header>
  );
}
