const items = [
    {
        "_id": new ObjectId(),
        "category": "Phone",
        "model": "iPhone 6",
        "producer": "Apple",
        "price": 600
    },
    {
        "_id": new ObjectId(),
        "category": "Phone",
        "model": "iPhone 12",
        "producer": "Apple",
        "price": 700
    },
    {
        "_id": new ObjectId(),
        "category": "TV",
        "model": "MySuperTvModel 6s",
        "producer": "SamSong",
        "outOfStock": true,  // No price
    },
    {
        "_id": new ObjectId(),
        "category": "Smart Watch",
        "model": "SamSong Galactic Watch",
        "producer": "SamSong",
        "price": 400
    },
    {
        "_id": new ObjectId(),
        "category": "Smart Watch",
        "model": "Peach Watch 2",
        "producer": "Peach",
        "price": 300
    },
    {
        "_id": new ObjectId(),
        "category": "Charger",
        "model": "iCharger",
        "producer": "Apple",
        "price": 700
    },
];
db.items.insertMany(items);

const orders = [
    {
        "order_number": 1,
        "date": ISODate("2015-04-14"),
        "total_sum": items[0].price + items[1].price,
        "customer": {
            "name": "Andrii",
            "surname": "Rodinov",
            "phones": [9876543, 1234567],
            "address": "PTI, Peremohy 37, Kyiv, UA"
        },
        "payment": {
            "card_owner": "Andrii Rodionov",
            "cardId": 12345678
        },
        "order_items_id": [
            {
                "$ref": "items",
                "$id": items[0]._id,
            },
            {
                "$ref": "items",
                "$id": items[1]._id,
            }
        ]
    },
    {
        "order_number": 2,
        "date": ISODate("2018-04-14"),
        "total_sum": items[0].price,
        "customer": {
            "name": "Neandrii",
            "surname": "Nerodinov",
            "phones": [9875644, 1234568],
            "address": "PTI, Peremohy 38, Kyiv, UA"
        },
        "payment": {
            "card_owner": "Neandrii Nerodionov",
            "cardId": 12345679
        },
        "order_items_id": [
            {
                "$ref": "items",
                "$id": items[0]._id,
            },
            {
                "$ref": "items",
                "$id": items[2]._id,
            },
        ]
    },
];

db.orders.insert(orders);