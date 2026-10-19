export const inr = (n) => "₹" + Number(n).toLocaleString("en-IN");
export const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
export const uid = () => Math.random().toString(36).slice(2, 9);
