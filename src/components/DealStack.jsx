import { heroDeals } from "../data/products.js";
import "../styles/DealStack.css";

export default function DealStack() {
  return (
    <div className="deal-stack" aria-hidden="true">
      {heroDeals.map((d) => (
        <div className="deal" key={d.id}>
          <div className="thumb" style={{ background: d.color }}><img src={d.image} alt="" /></div>
          <div className="deal-text">
            <b>{d.name}</b>
            <small>{d.sub}</small>
          </div>
          <div className="deal-price">
            ₹{d.price.toLocaleString("en-IN")}
            <span>{d.offer}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
