import ProductCard from "../commoncomponents/ProductCard.jsx";
import "../../styles/home/ProductSection.css";

export default function ProductSection({ id, title, products }) {
  return (
    <section className="block" id={id}>
      <div className="wrap">
        <div className="section-head">
          <h2>{title}</h2>
          <a href="#">View all</a>
        </div>
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
