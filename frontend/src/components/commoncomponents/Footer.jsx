
import styles from "../../styles/commonComponent/Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`wrap ${styles.footerRow}`}>
        <span>© 2026 BazaarNext</span>

        <nav aria-label="Footer">
          <a href="#">About</a>
          <a href="#">Help</a>
          <a href="#">Terms</a>
        </nav>
      </div>
    </footer>
  );
}
