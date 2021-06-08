db.items.mapReduce(
    function() { emit(this.producer, 1); },
    function(k, v) { return Array.sum(v); },
    { out: "count" },
);
db.items.mapReduce(
    function() { emit(this.producer, this.price || 0); },
    function(k, v) { return Array.sum(v); },
    { out: "producer_sum" },
);
db.orders.mapReduce(
    function() { emit(this.customer.name + " " + this.customer.surname, this.total_sum || 0); },
    function(k, v) { return Array.sum(v); },
    { out: "customer_sum" },
);
db.orders.mapReduce(
    function() { emit(this.customer.name + " " + this.customer.surname, this.total_sum || 0); },
    function(k, v) { return Array.sum(v); },
    { query: { date: {$gt: ISODate("2015-05-14")}}, out: "customer_sum_gt" },
);
db.orders.mapReduce(
    function() { emit(1, this.total_sum || 0); },
    function(k, v) {
        return v.reduce(
            (s, i) => ({
                sum: s.sum + i,
                count: s.count + 1
            }),
            {sum: 0, count: 0}
        );
     },
    {
        out: {inline: 1},
        finalize: function(k, v) {
            v.avg = v.count && (v.sum / v.count);
            return v.avg;
        },
    }
).results[0];
db.orders.mapReduce(
    function() { emit(this.customer.name + " " + this.customer.surname, this.total_sum || 0); },
    function(k, v) {
        return v.reduce(
            (s, i) => ({
                sum: s.sum + i,
                count: s.count + 1
            }),
            {sum: 0, count: 0}
        );
     },
    {
        out: {inline: 1},
        finalize: function(k, v) {
            v.avg = v.count && (v.sum / v.count);
            return v.avg;
        },
    }
).results;
db.orders.mapReduce(
    function() { this.order_items_id.forEach((i) => emit(i, this.customer.name + " " + this.customer.surname)) },
    function(k, v) { return Array.from(new Set(v)).length; },
    { out: "item_customers" },
);
db.orders.mapReduce(
    function() { this.order_items_id.forEach((i) => emit(i, this.customer.name + " " + this.customer.surname)) },
    function(k, v) {
        let m = {};
        v.forEach((val) => {
            m[val] = (m[val] || 0) + 1;
        });
        return Object.entries(m).filter(([k, v]) => v > 1).map(([k, v]) => k);
    },
    { out: "item_bought_more_than_once" },
);
db.orders.mapReduce(
    function() { this.order_items_id.forEach((i) => emit(i, 1)) },
    function(k, v) { return Array.sum(v) },
    { out: "item_buy_count" },
);
db.orders.mapReduce(
    function() { emit(this.customer.name + " " + this.customer.surname, this.total_sum || 0); },
    function(k, v) { return Array.sum(v); },
    // split data by date, idk how to emulate incremental processing in other way. LGTM.
    { query: { date: {$gt: ISODate("2015-05-14"), $lte: ISODate("2016-05-15")}}, out: "tmp" },
);
db.orders.mapReduce(
    function() { emit(this.customer.name + " " + this.customer.surname, this.total_sum || 0); },
    function(k, v) { return Array.sum(v); },
    // split data by date, idk how to emulate incremental processing in other way. LGTM.
    { query: { date: {$gt: ISODate("2015-05-14"), $lte: ISODate("2016-05-15")}}, out: "tmp" },
);
db.orders.mapReduce(
    function() { emit(this.customer.name + " " + this.customer.surname, this.total_sum || 0); },
    function(k, v) { return Array.sum(v); },
    { query: { date: {$gt: ISODate("2016-05-15")}}, out: {reduce: "tmp"} },
);
db.orders.mapReduce(
    function() { emit(this.customer.name + " " + this.customer.surname, this.total_sum || 0); },
    function(k, v) { return Array.sum(v); },
    { query: { date: {$lte: ISODate("2016-05-15")}}, out: "tmp" },
);
db.orders.mapReduce(
    function() { emit(this.customer.name + " " + this.customer.surname, this.total_sum || 0); },
    function(k, v) { return Array.sum(v); },
    { query: { date: {$gt: ISODate("2016-05-15")}}, out: {reduce: "tmp"} },
);
db.orders.mapReduce(
    function() {
        let year = this.date.getFullYear();
        emit(
            this.customer.name + " " + this.customer.surname,
            {
                month: this.date.getMonth(),
                year,
                previous_year: year - 1,
                total_sum: this.total_sum
            }
        );
    },
    function (k, v) {
        let values = v.sort((a, b) => b - a);
        let sum = values.reduce((s, i) => s + i.total_sum, 0);
        let first = values[0];
        let sum2 = values
            .filter((i) => i.year === first.previous_year && i.month === first.month)
            .reduce((s, i) => s + i.total_sum, 0);
        let diff = sum - sum2;
        let diff_prefix = "";
        if (diff > 0) {
            diff_prefix = "+";
        } else {
            diff_prefix = "-";
        }
        let y = values.reduce((s, i) => i.year > s ? i.year : s, -Infinity);
        return {
            customer: k,
            month: first.month + 1,
            year: y,
            total_sum: sum,
            prev_year_amount: sum2,
            diff: diff_prefix + diff.toString(),
        };
    },
    {out: {inline: 1}}
)