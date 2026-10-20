import { useCallback, useEffect, useRef, useState } from "react";

const storageKey = (userKey, productId) => `bazaarnext_chat_${userKey}_${productId}`;
const load = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
};
const newId = () => Math.random().toString(36).slice(2, 9);
const inr = (n) => "₹" + Number(n).toLocaleString("en-IN");

// Demo seller ke simple replies. Real project me ye backend / socket se aayega.
const cannedReply = (text) => {
  const t = text.toLowerCase();
  if (t.includes("available")) return "Haan, abhi available hai.";
  if (/(where|meet|kaha|kahan)/.test(t)) return "Ulhasnagar station ke paas kisi public jagah pe mil sakte hain.";
  if (/(price|kam|less|discount)/.test(t)) return "Aap 'Make an offer' se apna price bhej sakte ho, main dekh lunga.";
  return "Thik hai, bataiye. Aap kab milna chahenge?";
};

export default function useChat({ productId, userKey, price }) {
  const key = storageKey(userKey, productId);
  const [messages, setMessages] = useState(() => load(key));
  const [typing, setTyping] = useState(false);
  const timers = useRef([]);

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(messages));
    } catch {}
  }, [key, messages]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const add = useCallback(
    (m) => setMessages((prev) => [...prev, { id: newId(), at: new Date().toISOString(), ...m }]),
    []
  );
  const patch = useCallback(
    (id, changes) => setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, ...changes } : m))),
    []
  );
  const sellerSays = useCallback((fn, delay = 1300) => {
    setTyping(true);
    timers.current.push(
      setTimeout(() => {
        fn();
        setTyping(false);
      }, delay)
    );
  }, []);

  const sendText = (text) => {
    const t = text.trim();
    if (!t) return;
    add({ from: "buyer", type: "text", text: t });
    sellerSays(() => add({ from: "seller", type: "text", text: cannedReply(t) }));
  };

  const sendOffer = (amount) => {
    const id = newId();
    setMessages((prev) => [
      ...prev,
      { id, at: new Date().toISOString(), from: "buyer", type: "offer", amount, status: "pending" },
    ]);
    sellerSays(() => {
      if (amount >= price * 0.85) {
        patch(id, { status: "accepted" });
        add({ from: "seller", type: "text", text: `Deal! ${inr(amount)} me de dunga.` });
      } else {
        const counter = Math.min(price, Math.max(amount + 10, Math.round((amount + price) / 2 / 10) * 10));
        patch(id, { status: "countered" });
        add({ from: "seller", type: "offer", amount: counter, status: "pending" });
      }
    });
  };

  // Seller ke counter offer pe buyer ka jawab
  const respondOffer = (id, accept) => {
    patch(id, { status: accept ? "accepted" : "declined" });
    if (!accept) sellerSays(() => add({ from: "seller", type: "text", text: "Koi baat nahi, aap naya offer bhej sakte ho." }), 900);
  };

  const accepted = [...messages].reverse().find((m) => m.type === "offer" && m.status === "accepted");
  const hasPendingOffer = messages.some((m) => m.type === "offer" && m.status === "pending");

  return {
    messages,
    typing,
    agreed: accepted ? { id: accepted.id, amount: accepted.amount } : null,
    hasPendingOffer,
    sendText,
    sendOffer,
    respondOffer,
  };
}