import DealStack from "./DealStack.jsx";
import "../../styles/home/Hero.css";

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
        </div>
        <DealStack />
      </div>
    </div>
  );
}
