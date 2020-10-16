const db = new Mongo().getDB("mydb");
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

printLine();

// Print all orders
db.orders.find().forEach(printjson);

printLine();

// Print all orders where total sum greater than 700
print("Orders with total_sum > 700");
db.orders.find({ total_sum: { "$gt": 700 } }).forEach(printjson);

printLine();

// Find all orders of one customer. Since there can be many Andrii Rodionov's 
// it is better to query based on all contact information
print("Andrii Rodinov orders:");
db.orders.find({
    customer: {
        "name": "Andrii",
        "surname": "Rodinov",
        "phones": [9876543, 1234567],
        "address": "PTI, Peremohy 37, Kyiv, UA"
    }
}).forEach(printjson);

printLine();

// Find all orders with specific item 
print("Orders with MySuperTvModel 6s");
const targetItem = db.items.findOne({ model: "MySuperTvModel 6s" });
db.orders.find({ "order_items_id.$id": targetItem._id }).forEach(printjson);

printLine();

// Update all orders with iPhone 12 to add charger
const iphone = db.items.findOne({ model: /iPhone/ });
const charger = db.items.findOne({ model: "iCharger" });
db.orders.update(
    { "order_items_id.$id": iphone._id },
    {
        "$inc": { "total_sum": charger.price },
        "$push": { "order_items_id": { "$ref": "items", "$id": charger._id } }
    },
    { multi: true }
)
print("Orders with charger for iPhone");
db.orders.find({ "order_items_id.$id": iphone._id }).forEach(printjson);

printLine();

// Total items in order
const targetOrder = db.orders.findOne();
// Simple as that
print(`Total items in order: ${targetOrder.order_items_id.length}`);
// With pipelines like a man
print(db.orders.aggregate([
    { "$match": { _id: targetOrder._id } },
    { "$project": { arrSize: { "$size": "$order_items_id" } } },
    { "$limit": 1 },
]).next().arrSize);

printLine();

// only subset of fields for every order with total_sum > 700
print("Customer and credit card for orders where total_sum > 700");
db.orders.find(
    { total_sum: { "$gt": 700 } },
    { customer: 1, "payment.cardId": 1, _id: 0 }
).forEach(printjson);

printLine();

// Remove item for orders before today
const dateFrom = ISODate("2018-01-01");
const dateUntil = ISODate("2019-01-01");
const itemToRemove = db.items.findOne({ model: /iPhone 6/ });
db.orders.update(
    {},
    { $pull: { "order_items_id": { "$id": itemToRemove._id } } },
    { multi: true }
);
print(`Target item id to remove: ${itemToRemove._id}`);
print("Order items by number:")
db.orders.find({}, { order_number: 1, order_items_id: 1, _id: 0 }).forEach(printjson);

printLine();

// Update customer surname
db.orders.update(
    {},
    { "$set": { "customer.surname": "<CENSORED>" } },
    { multi: true }
);
print("All customers after surname update:")
db.orders.distinct("customer").forEach(printjson);