sh.status();
use store;
sh.enableSharding("store");
sh.addShardTag("rs1", "lt_50");
sh.addShardTag("rs2", "50_100");
sh.addShardTag("rs3", "gt_100");
sh.addTagRange("store.orders", {total: MinKey}, {total: 50}, "lt_50");
sh.addTagRange("store.orders", {total: 51}, {total: 100}, "50_100");
sh.addTagRange("store.orders", {total: 101}, {total: MaxKey}, "gt_100");
sh.shardCollection("store.orders", {total: 1});
db.orders.getShardDistribution();
db.orders.insertMany([
    {total: 20},
    {total: 70},
    {total: 120},
]);
var totals = [20, 70, 120]; 
for (var i of totals) {
    var shards = db.orders.find({total:i}).explain()['queryPlanner']['winningPlan']['shards'];
    print("total shards of " + i.toString() + " " + shards.length.toString());
    print(i.toString() + " shard name is " + shards[0]['shardName']);
}
sh.addShardTag("rs1", "edibles");
sh.addShardTag("rs2", "edibles");
sh.addShardTag("rs3", "ediblesButOnce");
sh.addTagRange( 
    "store.items",
    { "category" : "meat", "_id" : MinKey },
    { "category" : "meat", "_id" : MaxKey }, 
    "edibles"
);
sh.addTagRange( 
    "store.items",
    { "category" : "alcohol", "_id" : MinKey },
    { "category" : "alcohol", "_id" : MaxKey }, 
    "edibles"
);
sh.addTagRange( 
    "store.items",
    { "category" : "washing powder", "_id" : MinKey },
    { "category" : "washing powder", "_id" : MaxKey }, 
    "ediblesButOnce"
);
db.items.insertMany([
    {"category": "meat", "name": "pork"},
    {"category": "meat", "name": "chicken"},
    {"category": "alcohol", "name": "vodka"},
    {"category": "washing powder", "name": "tide"},
    {"category": "washing powder", "name": "persil"},
    {"category": "washing powder", "name": "pervol"},
    {"category": "washing powder", "name": "zvuchyainuy poroshok"},
]);
db.items.ensureIndex({category: 1, _id: 1});
sh.shardCollection("store.items", {category: 1, _id: 1});
db.items.getShardDistribution()
db.items.insert({"category": "washing powder", "name": "gala"});
db.orders.insert({"total": 100500});
db.items.insert({"category": "meat", "name": "goose"});
db.orders.insert({"total": 10});
db.items.find({"category": {$in: ["meat", "alcohol"]}});
db.items.find({"category": "washing powder"});
db.orders.find({total: 100500});
db.orders.find({total: {$lt:50}});