db.auth("dbadmin", "dbadminpassword");
db = db.getSiblingDB("mydb");
db.createUser({
    user: "myuser",
    pwd: "verysafepassword",
    roles: [{
        role: "readWrite",
        db: "mydb"
    }],
});

const items = [
    {
        "category" : "Phone",
        "model" : "iPhone 6",
        "producer" : "Apple",
        "price" : 600
    },
    {
        "category" : "TV",
        "model" : "MySuperTvModel 6s",
        "producer" : "SamSong",
        "outOfStock": true,
    },
    {
        "category" : "Smart Watch",
        "model" : "SamSong Galactic Watch",
        "producer" : "SamSong",
        "price" : 400
    },
    {
        "category" : "Smart Watch",
        "model" : "Peach Watch 2",
        "producer" : "Peach",
        "price" : 300
    },
];
db.items.insertMany(items);