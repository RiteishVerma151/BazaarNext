import { Link } from "react-router-dom";
import "../../styles/home/CategorySection.css";

const categories = [
  "Electronics",
  "Fashion",
  "Books",
  "Furniture",
  "Home Appliances",
  "Sports",
  "Vehicles",
  "Other",
];

export default function CategorySection() {
  return (
    <section className="block">
      <div className="wrap">
        <div className="section-head">
          <h2>Shop by category</h2>
        </div>

        <div className="cats">
          {categories.map((category) => (
            <Link
              key={category}
              className="cat"
              to={`/products?cat=${encodeURIComponent(category)}`}
            >
              {category}
              <small>Explore {category}</small>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}