db = new Mongo().getDB("mydb");
// We all like side effects, aren't we?
if (db.auth("myuser", "verysafepassword")) {
    print("Connected!");
}


// utility function
function printLine(symbol = "-", lineLen = 80) {
    print(symbol.repeat(lineLen));
}


// Get all items and print them in json
print('All items')
db.items.find().forEach(printjson);

printLine();

// Count all items with category "Smart Watch"
const smartWatchesCount = db.items.count({ category: "Smart Watch" });
print(`Smart Watches count: ${smartWatchesCount}`);

printLine();

// Count distinct categories
const totalCategories = db.items.distinct("category").length;
print(`Distinct categories: ${totalCategories}`);

printLine();

// Find all items where (400 <= price <= 500)
const maxPrice = 500;
const minPrice = 400;
print(`${minPrice} <= price <= ${minPrice}`);
db.items.find({ price: { $gte: minPrice, $lte: maxPrice } }).forEach(printjson);

printLine();

// Find all products where producer either Apple or SamSong
print("SELECT * FROM items WHERE producer IN ('Apple', 'SamSong')");
db.items.find({ producer: { $in: ["Apple", "SamSong"] } }).forEach(printjson);

printLine();

// All distinct producers
print(`Distinct producers are: ${db.items.distinct("producer").join(', ')}`);

printLine();

// iPhone 6 becomes iPhone 6+ - removed headphones, eco-friendly
// Achieved via data aggregation pipeline
db.items.update(
    {
        model: /iPhone/
    },
    [
        {
            "$set": {
                "model": { "$concat": ["$model", "+"] },
                "isOverpriced": true,
            },
        }
    ],
    { multi: true }
);
// print iPhones
print('IPhone items')
db.items.find({ model: /iPhone/ }).forEach(printjson);

printLine();

// Get all out of stock items
print('Overpriced items')
const overpricedItems = db.items.find({ isOverpriced: { "$exists": true } });
overpricedItems.forEach((item) => {
    db.items.update(
        { _id: item._id },
        { "$inc": { "price": 100 } },
    );
})
db.items.find({ isOverpriced: { "$exists": true } }).forEach(printjson);