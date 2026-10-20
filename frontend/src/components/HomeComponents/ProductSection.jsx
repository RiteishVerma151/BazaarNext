import { Link } from "react-router-dom";
import ProductCard from "../commoncomponents/ProductCard.jsx";
import "../../styles/home/ProductSection.css";

export default function ProductSection({
  id,
  title,
  products = [],
  loading = false,
}) {
  return (
    <section className="block" id={id}>
      <div className="wrap">
        <div className="section-head">
          <h2>{title}</h2>
          <Link to="/products">View all</Link>
        </div>

        {loading ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p>No products available right now.</p>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard
                key={product._id ?? product.id}
                product={product}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}