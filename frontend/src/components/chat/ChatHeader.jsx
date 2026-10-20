import { Link } from "react-router-dom";
import styles from "../../styles/chat/ChatHeader.module.css";

export default function ChatHeader({ product, seller }) {
  return (
    <header className={styles.header}>
      <Link to={`/product/${product.id}`} className={styles.back} aria-label="Back to product">
        ←
      </Link>
      <img src={product.image} alt="" className={styles.thumb} />
      <div className={styles.info}>
        <h1>{product.name}</h1>
        <p>
          Listed at <b>₹{product.price.toLocaleString("en-IN")}</b> · {seller.name}
        </p>
      </div>
      <span className={styles.online}>Online</span>
    </header>
  );
}