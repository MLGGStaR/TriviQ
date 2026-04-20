import fs from "node:fs";
let app = fs.readFileSync("src/App.jsx", "utf8");
const failed = [
  "Microsoft_Surface_Pro_9",
  "Bose_QuietComfort",
  "Patek_Philippe_Nautilus",
  "Audemars_Piguet_Royal_Oak",
  "TAG_Heuer_Carrera",
  "Range_Rover_(car)",
  "Peloton_(company)",
];
let removed = 0;
for (const wiki of failed) {
  const esc = wiki.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`^\\s*\\{q:"Guess the retail price of this product",a:"[^"]*",wiki:"${esc}"\\},\\n`, "gm");
  const before = app.length;
  app = app.replace(re, "");
  if (app.length < before) {
    removed++;
    console.log("Removed:", wiki);
  } else {
    console.log("NOT FOUND:", wiki);
  }
}
fs.writeFileSync("src/App.jsx", app);
console.log("Total removed:", removed);
