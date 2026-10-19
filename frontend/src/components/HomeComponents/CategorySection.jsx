import { categories } from "../../data/products.js";
import "../../styles/home/CategorySection.css";

export default function CategorySection() {
  return (
    <section className="block">
      <div className="wrap">
        <div className="section-head"><h2>Shop by category</h2></div>
        <div className="cats">
          {categories.map((c) => (
            <a key={c.id} className="cat" href="#">
              {c.name}
              <small>{c.hint}</small>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
