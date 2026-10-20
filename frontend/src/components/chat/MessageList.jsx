import { useEffect, useRef } from "react";
import styles from "../../styles/chat/MessageList.module.css";

const inr = (n) => "₹" + Number(n).toLocaleString("en-IN");
const time = (d) => new Date(d).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

const statusLabel = {
  pending: "Waiting for reply",
  accepted: "Accepted",
  countered: "Countered",
  declined: "Declined",
};

export default function MessageList({ messages, typing, sellerName, agreed, onRespond, onCheckout }) {
  const listRef = useRef(null);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length, typing]);

  return (
    <div className={styles.list} ref={listRef} aria-live="polite">
      {messages.length === 0 && (
        <div className={styles.empty}>
          <b>Start the conversation</b>
          <span>Ask about the item or send your price to {sellerName}.</span>
        </div>
      )}

      {messages.map((m) => {
        const mine = m.from === "buyer";
        return (
          <div key={m.id} className={`${styles.row} ${mine ? styles.mine : ""}`}>
            {m.type === "text" ? (
              <div className={styles.bubble}>
                {m.text}
                <small>{time(m.at)}</small>
              </div>
            ) : (
              <div className={`${styles.offer} ${styles[m.status]}`}>
                <span className={styles.offerLabel}>{mine ? "You offered" : `${sellerName} offered`}</span>
                <strong>{inr(m.amount)}</strong>

                {!mine && m.status === "pending" ? (
                  <div className={styles.offerActions}>
                    <button className={styles.accept} onClick={() => onRespond(m.id, true)}>Accept</button>
                    <button className={styles.decline} onClick={() => onRespond(m.id, false)}>Decline</button>
                  </div>
                ) : (
                  <span className={styles.status}>{statusLabel[m.status]}</span>
                )}

                {agreed && agreed.id === m.id && (
                  <button className={styles.checkout} onClick={onCheckout}>
                    Proceed to checkout at {inr(agreed.amount)}
                  </button>
                )}
                <small>{time(m.at)}</small>
              </div>
            )}
          </div>
        );
      })}

      {typing && (
        <div className={styles.row}>
          <div className={`${styles.bubble} ${styles.typing}`} aria-label={`${sellerName} is typing`}>
            <i /><i /><i />
          </div>
        </div>
      )}
    </div>
  );
}