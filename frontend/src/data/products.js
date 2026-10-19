
const files = import.meta.glob("../assets/products/*.{jpg,jpeg,png,webp,svg}", { eager: true, import: "default" })

const pic = (name) => {
  for (const ext of ["jpg", "jpeg", "png", "webp", "svg"]) {
    const f = files[`../assets/products/${name}.${ext}`];
    if (f) return f;
  }
}

const cycle = pic("cycle"), backpack = pic("backpack"), table = pic("table"), chair = pic("chair");
const calculator = pic("calculator"), fan = pic("fan"), books = pic("books"), speaker = pic("speaker")


export const categories = [
  { id: 1, name: "Electronics", hint: "Phones, laptops" },
  { id: 2, name: "Furniture", hint: "Tables, chairs" },
  { id: 3, name: "Books & notes", hint: "Study material" },
  { id: 4, name: "Vehicles", hint: "Cycles, bikes" },
  { id: 5, name: "Fashion", hint: "Clothes, shoes" },
  { id: 6, name: "Daily essentials", hint: "Home, kitchen" },
];

export const freshProducts = [
  { id: 1, name: "Hero cycle", price: 2800, condition: "Good", info: "Ulhasnagar 3", image: cycle, color: "#0F7A6B" },
  { id: 2, name: "School backpack", price: 450, condition: "Like new", info: "Ulhasnagar 1", image: backpack, color: "#7A4FD1" },
  { id: 3, name: "Study table", price: 1200, condition: "Fair", info: "Ulhasnagar 4", image: table, color: "#D6573C" },
  { id: 4, name: "Office chair", price: 1500, condition: "Good", info: "Ulhasnagar 2", image: chair, color: "#2B6CB0" },
];

export const topProducts = [
  { id: 5, name: "Scientific calculator", price: 350, condition: "Like new", info: "24 sold", image: calculator, color: "#B7791F" },
  { id: 6, name: "Table fan", price: 900, condition: "Good", info: "18 sold", image: fan, color: "#2C7A7B" },
  { id: 7, name: "Engineering books", price: 600, condition: "Good", info: "15 sold", image: books, color: "#9B2C2C" },
  { id: 8, name: "Bluetooth speaker", price: 1100, condition: "Fair", info: "12 sold", image: speaker, color: "#553C9A" },
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
