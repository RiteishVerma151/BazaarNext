
// const day = 86400000;
// const ago = (n) => new Date(Date.now() - n * day).toISOString();

// export const seedUsers = [
//   { id: "u1", name: "Demo User", email: "demo@bazaarnext.in", password: "demo123", phone: "9876543210", area: "Ulhasnagar 3", joinedAt: ago(200) },
//   { id: "u2", name: "Aarav Mehta", email: "aarav@example.com", password: "x", phone: "9000000002", area: "Ulhasnagar 2", auto: true, joinedAt: ago(180) },
//   { id: "u3", name: "Neha Kapoor", email: "neha@example.com", password: "x", phone: "9000000003", area: "Ulhasnagar 1", auto: true, joinedAt: ago(170) },
// ];

// const P = (id, name, price, category, condition, area, stock, sellerId, imageKey, description, d) => ({
//   id, name, price, category, condition, area, stock, sellerId, imageKey, description, createdAt: ago(d),
// });

// export const seedProducts = [
//   P("p1", "Hero cycle", 2800, "Vehicles", "Good", "Ulhasnagar 3", 1, "u2", "cycle", "Hero cycle, 2 years old. Gears work fine, new tyres put last month. Pickup near Ulhasnagar station.", 2),
//   P("p2", "School backpack", 450, "Fashion", "Like new", "Ulhasnagar 1", 1, "u3", "backpack", "Used for one semester only. Three zips, laptop pocket, no tears.", 3),
//   P("p3", "Study table", 1200, "Furniture", "Fair", "Ulhasnagar 4", 1, "u1", "table", "Wooden study table with one drawer. Minor scratches on the top, sturdy legs.", 4),
//   P("p4", "Office chair", 1500, "Furniture", "Good", "Ulhasnagar 2", 1, "u2", "chair", "Height adjustable chair with wheels. Cushion in good shape.", 6),
//   P("p5", "Scientific calculator", 350, "Electronics", "Like new", "Ulhasnagar 3", 8, "u1", "calculator", "Casio scientific calculator, works perfectly. Cover included.", 20),
//   P("p6", "Table fan", 900, "Daily essentials", "Good", "Ulhasnagar 3", 6, "u1", "fan", "3-speed table fan, runs silently. Oscillation works.", 25),
//   P("p7", "Engineering books", 600, "Books & notes", "Good", "Ulhasnagar 1", 4, "u3", "books", "Set of first-year engineering books. Few pencil notes inside.", 30),
//   P("p8", "Bluetooth speaker", 1100, "Electronics", "Fair", "Ulhasnagar 2", 3, "u2", "speaker", "Portable speaker, around 6 hours battery. Small dent on the side.", 40),
// ];

// // [productId, buyerId, price, daysAgo, rating|null, comment]
// const sales = [
//   ["p5", "u2", 350, 150, 5, "Works perfectly, thanks!"],
//   ["p5", "u3", 330, 120, 4, "Good deal."],
//   ["p5", "u2", 340, 95, 5, "Like new, fast meetup."],
//   ["p6", "u3", 850, 110, 4, "Fan is silent, happy."],
//   ["p5", "u3", 350, 60, null, ""],
//   ["p6", "u2", 900, 70, 5, "Nice seller."],
//   ["p3", "u3", 1100, 20, 4, "Table is sturdy."],
//   ["p5", "u2", 320, 30, 5, "Great."],
//   ["p6", "u3", 880, 12, null, ""],
//   ["p5", "u3", 350, 5, null, ""],
//   ["p7", "u1", 550, 40, 5, "Books were as described."],
//   ["p7", "u2", 600, 55, 4, ""],
//   ["p7", "u2", 580, 90, 5, ""],
//   ["p7", "u3", 600, 100, 4, ""],
//   ["p8", "u3", 1000, 45, 4, "Sound is good."],
//   ["p8", "u1", 1100, 80, 5, "Loud and clear."],
//   ["p2", "u2", 400, 35, 5, "Like new indeed."],
//   ["p1", "u1", 2600, 8, null, ""],
// ];

// const sellerOf = Object.fromEntries(seedProducts.map((p) => [p.id, p.sellerId]));
// const nameOf = Object.fromEntries(seedProducts.map((p) => [p.id, p.name]));

// export const seedOrders = sales.map(([pid, buyerId, price, d, rating, comment], i) => ({
//   id: "BN" + (4100 + i),
//   productId: pid,
//   productName: nameOf[pid],
//   price,
//   buyerId,
//   sellerId: sellerOf[pid],
//   date: ago(d),
//   payment: "UPI",
//   status: "Delivered",
//   address: { name: "", phone: "", area: "" },
//   review: rating ? { rating, comment, at: ago(d - 2) } : null,
// }));

// export const seedNegotiations = [
//   {
//     id: "n1", productId: "p5", buyerId: "u2", status: "open", agreedPrice: null,
//     offers: [{ by: "buyer", amount: 280, at: ago(1) }],
//   },
// ];
