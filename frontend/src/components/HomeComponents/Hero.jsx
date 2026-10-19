import SearchBar from "../commoncomponents/SearchBar.jsx";
import DealStack from "./DealStack.jsx";
import "../../styles/home/Hero.css";

const quick = ["Study material", "Furniture", "Mobiles", "Cycles"];

export default function Hero() {
  return (
    <div className="hero">
      <div className="wrap hero-grid">
        <div>
          <h1>Instant deals right next door.</h1>
          <p className="sub">
            Buy and sell used goods and daily essentials with people in your own
            neighbourhood. Bargain directly, pay securely, and check reviews first.
          </p>
          <SearchBar />
          <div className="chips">
            {quick.map((q) => (
              <a key={q} className="chip" href="#">{q}</a>
            ))}
          </div>
        </div>
        <DealStack />
      </div>
    </div>
  );
}
