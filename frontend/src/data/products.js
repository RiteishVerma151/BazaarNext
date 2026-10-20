import cycle from "../assets/products/cycle.svg";
import backpack from "../assets/products/backpack.svg";
import table from "../assets/products/table.svg";

const img = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=600&q=80`;

export const PRODUCTS = [
  { id: 1,  name: "School backpack",      price: 450,  condition: "Like new", info: "Ulhasnagar 1", image: img("1553062407-98eeb64c6a62"), category: "Bags",             keywords: "bag backpack school", description: "Good quality school backpack. Barely used, has multiple compartments." },
  { id: 2,  name: "Laptop bag",           price: 650,  condition: "Good",     info: "Ulhasnagar 2", image: img("1548036328-c9fa89d128fa"), category: "Bags",             keywords: "bag laptop office", description: "Spacious laptop bag with padded sleeve. Perfect for office use." },
  { id: 3,  name: "Travel duffel bag",    price: 900,  condition: "Good",     info: "Ulhasnagar 3", image: img("1547949003-9792a18a2601"), category: "Bags",             keywords: "bag travel duffel", description: "Large travel duffel bag, great for weekend trips." },
  { id: 4,  name: "College sling bag",    price: 300,  condition: "Fair",     info: "Ulhasnagar 4", image: img("1591561954557-26941169b49e"), category: "Bags",           keywords: "bag sling college", description: "Casual sling bag for college. Some signs of wear." },
  { id: 5,  name: "Trekking rucksack",    price: 1800, condition: "Good",     info: "Ulhasnagar 1", image: img("1622260614153-03223fb72052"), category: "Bags",           keywords: "bag trekking rucksack", description: "Heavy duty trekking rucksack with rain cover." },
  { id: 6,  name: "Tote bag",             price: 150,  condition: "Like new", info: "Ulhasnagar 2", image: img("1590874103328-eac38a683ce7"), category: "Bags",           keywords: "bag tote", description: "Stylish tote bag, like new condition." },
  { id: 7,  name: "Kids school bag",      price: 350,  condition: "Good",     info: "Ulhasnagar 5", image: img("1581605405669-fcdf81165afa"), category: "Bags",           keywords: "bag kids school", description: "Colorful school bag for kids. Very sturdy." },
  { id: 8,  name: "Office messenger bag", price: 700,  condition: "Like new", info: "Ulhasnagar 3", image: img("1553062407-98eeb64c6a62"), category: "Bags",             keywords: "bag office messenger", description: "Premium messenger bag for office professionals." },
  { id: 9,  name: "Gym bag",              price: 500,  condition: "Good",     info: "Ulhasnagar 4", image: img("1547949003-9792a18a2601"), category: "Bags",             keywords: "bag gym sports", description: "Durable gym bag with shoe compartment." },
  { id: 10, name: "Camera bag",           price: 1200, condition: "Fair",     info: "Ulhasnagar 1", image: img("1502920917128-1aa500764cbd"), category: "Bags",           keywords: "bag camera", description: "Padded camera bag with adjustable dividers." },
  { id: 11, name: "Hand bag",             price: 400,  condition: "Good",     info: "Ulhasnagar 2", image: img("1584917865442-de89df76afd3"), category: "Bags",           keywords: "bag handbag ladies", description: "Elegant hand bag for daily use." },
  { id: 12, name: "Waterproof backpack",  price: 950,  condition: "Like new", info: "Ulhasnagar 3", image: img("1622560480605-d83c853bc5c3"), category: "Bags",           keywords: "bag backpack waterproof", description: "Fully waterproof backpack, great for monsoon." },
  { id: 13, name: "Wheeled trolley bag",  price: 2200, condition: "Good",     info: "Ulhasnagar 5", image: img("1565026057447-bc90a3dceb87"), category: "Bags",           keywords: "bag trolley travel", description: "Convenient wheeled trolley bag for travel." },
  { id: 14, name: "Laptop backpack",      price: 1100, condition: "Good",     info: "Ulhasnagar 4", image: img("1622560480605-d83c853bc5c3"), category: "Bags",           keywords: "bag backpack laptop", description: "Laptop backpack with USB charging port." },
  { id: 15, name: "Hero cycle",           price: 2800, condition: "Good",     info: "Ulhasnagar 3", image: img("1485965120184-e220f721d03e"), category: "Cycles",         keywords: "cycle bicycle", description: "Well-maintained Hero cycle. Smooth ride." },
  { id: 16, name: "Study table",          price: 1200, condition: "Fair",     info: "Ulhasnagar 4", image: img("1555041469-a586c61ea9bc"), category: "Furniture",         keywords: "table study desk", description: "Wooden study table, sturdy build." },
  { id: 17, name: "Office chair",         price: 1500, condition: "Good",     info: "Ulhasnagar 2", image: img("1580480055273-228ff5388ef8"), category: "Furniture",       keywords: "chair office", description: "Ergonomic office chair with lumbar support." },
  { id: 18, name: "Table fan",            price: 900,  condition: "Good",     info: "Ulhasnagar 2", image: img("1558618666-fcd25c85cd64"), category: "Daily essentials", keywords: "fan table", description: "High speed table fan. Works perfectly." },
];

// ---- Home page ke liye data ----
export const categories = [
  { id: 1, name: "Bags", hint: "Backpacks, laptop bags" },
  { id: 2, name: "Furniture", hint: "Tables, chairs" },
  { id: 3, name: "Cycles", hint: "Cycles, bikes" },
  { id: 4, name: "Daily essentials", hint: "Home, kitchen" },
];

export const heroDeals = [
  { id: 1, name: "Hero cycle, 2 yrs old", sub: "Used, good condition", price: 2800, offer: "Offer: ₹2,500", image: cycle, color: "#0F7A6B" },
  { id: 2, name: "School backpack", sub: "Like new", price: 450, offer: "Accepted", image: backpack, color: "#7A4FD1" },
  { id: 3, name: "Study table", sub: "Used, minor scratches", price: 1200, offer: "Offer: ₹1,000", image: table, color: "#D6573C" },
];

export const steps = [
  { id: 1, title: "Find", text: "Search or browse items in your locality." },
  { id: 2, title: "Negotiate", text: "Send your price offer to the seller." },
  { id: 3, title: "Pay", text: "Complete the order with secure payment." },
  { id: 4, title: "Review", text: "Rate the seller to help the next buyer." },
];

// Home page ke sections (PRODUCTS me se hi liye gaye hain)
const COLORS = { Bags: "#7A4FD1", Cycles: "#0F7A6B", Furniture: "#D6573C", "Daily essentials": "#2C7A7B" };
const withColor = (p) => ({ ...p, color: COLORS[p.category] || "#2B6CB0" });

export const freshProducts = [15, 16, 17, 1].map((id) => withColor(PRODUCTS.find((p) => p.id === id)));
export const topProducts = [2, 18, 12, 10].map((id) => withColor(PRODUCTS.find((p) => p.id === id)));