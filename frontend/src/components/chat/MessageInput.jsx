import { useState } from "react";
import styles from "../../styles/chat/MessageInput.module.css";

const QUICK = ["Is it still available?", "Where can we meet?", "Can you reduce the price?"];

export default function MessageInput({ price, agreed, hasPendingOffer, typing, showQuick, onSendText, onSendOffer }) {
  const [text, setText] = useState("");
  const [offerMode, setOfferMode] = useState(false);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const sendText = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSendText(text);
    setText("");
  };

  const sendOffer = (e) => {
    e.preventDefault();
    const n = Number(amount);
    if (!(n > 0)) return setError("Enter a valid amount.");
    if (n > price) return setError(`Offer cannot be higher than the listed price (₹${price.toLocaleString("en-IN")}).`);
    setError("");
    onSendOffer(n);
    setAmount("");
    setOfferMode(false);
  };

  const offerBlocked = Boolean(agreed) || hasPendingOffer || typing;

  return (
    <div className={styles.box}>
      {agreed && <div className={styles.notice}>Deal agreed at ₹{agreed.amount.toLocaleString("en-IN")}. You can proceed to checkout.</div>}

      {showQuick && !offerMode && (
        <div className={styles.quick}>
          {QUICK.map((q) => (
            <button key={q} type="button" onClick={() => onSendText(q)}>{q}</button>
          ))}
        </div>
      )}

      {offerMode ? (
        <form className={styles.form} onSubmit={sendOffer} noValidate>
          <label htmlFor="offer" className={styles.rupee}>₹</label>
          <input
            id="offer"
            type="number"
            min="1"
            autoFocus
            placeholder={`Your offer (max ${price})`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button type="submit" className={styles.send}>Send offer</button>
          <button type="button" className={styles.ghost} onClick={() => { setOfferMode(false); setError(""); }}>Cancel</button>
        </form>
      ) : (
        <form className={styles.form} onSubmit={sendText}>
          <input
            type="text"
            aria-label="Type a message"
            placeholder="Type a message"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button type="submit" className={styles.send}>Send</button>
          <button type="button" className={styles.ghost} onClick={() => setOfferMode(true)} disabled={offerBlocked}>
            Make an offer
          </button>
        </form>
      )}

      {error && <div className={styles.error} role="alert">{error}</div>}
    </div>
  );
}