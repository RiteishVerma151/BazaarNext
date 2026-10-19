import { steps } from "../../data/products.js";
import "../../styles/home/HowItWorks.css";

export default function HowItWorks() {
  return (
    <section className="block">
      <div className="wrap">
        <div className="section-head"><h2>How BazaarNext works</h2></div>
        <div className="steps">
          {steps.map((s) => (
            <div className="step" key={s.id}>
              <i>Step {s.id}</i>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
