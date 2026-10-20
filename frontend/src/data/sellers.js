// Demo sellers. Real project me ye product ke saath backend se aayega.
const SELLERS = [
  { name: "Rahul Sharma", rating: 4.8, joined: "March 2023" },
  { name: "Aarav Mehta", rating: 4.6, joined: "June 2023" },
  { name: "Neha Kapoor", rating: 4.9, joined: "January 2024" },
  { name: "Priya Nair", rating: 4.5, joined: "August 2024" },
];

export const getSeller = (productId) => SELLERS[Number(productId) % SELLERS.length];