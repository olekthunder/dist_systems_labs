CREATE KEYSPACE IF NOT EXISTS lab3 
WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : 1 };


USE lab3;


-- Create tables
-- + items
CREATE TABLE IF NOT EXISTS items (
    id int,
    name  text,
    producer text,
    category text,
    price int,
    PRIMARY KEY ((category), price, id),
    params map<text, text>,
);
-- + orders
CREATE TABLE IF NOT EXISTS orders (
    order_id int,
    customer text,
    dt timestamp,
    items_list  list<int>,
    sum int,
    PRIMARY KEY(customer, dt, order_id)
);

-- IDXs
-- + items
CREATE INDEX IF NOT EXISTS name_idx ON items (name);
CREATE INDEX IF NOT EXISTS producer_idx ON items (producer);
CREATE INDEX IF NOT EXISTS params_idx ON items (KEYS (params));
CREATE INDEX IF NOT EXISTS v_params_idx ON items (values (params));
CREATE INDEX IF NOT EXISTS e_params_idx ON items (entries (params));
-- + orders
CREATE INDEX IF NOT EXISTS items_list_idx ON orders (values(items_list));


-- Populate data
-- + items
INSERT INTO Items (id, name, producer, category, price, params) VALUES (1, 'Item1', 'Producer1', 'Category1', 300, {'param1': '1'}) IF NOT EXISTS;
INSERT INTO Items (id, name, producer, category, price, params) VALUES (2, 'Item2', 'Producer1', 'Category1', 500, {'param1': '2'}) IF NOT EXISTS;
INSERT INTO Items (id, name, producer, category, price, params) VALUES (3, 'Item3', 'Producer2', 'Category1', 500, {'param1': '2'}) IF NOT EXISTS;
INSERT INTO Items (id, name, producer, category, price, params) VALUES (4, 'Item4', 'Producer2', 'Category1', 250, {'param1': '3'}) IF NOT EXISTS;
INSERT INTO Items (id, name, producer, category, price, params) VALUES (5, 'Item5', 'Producer3', 'Category2', 1000, {'param2': 'param2_val', 'param1': '6'}) IF NOT EXISTS;
INSERT INTO Items (id, name, producer, category, price, params) VALUES (6, 'Item6', 'Producer3', 'Category2', 800, {'param2': 'param2_val', 'param1': '4'}) IF NOT EXISTS;
INSERT INTO Items (id, name, producer, category, price, params) VALUES (7, 'Item7', 'Producer3', 'Category3', 2000, {'param3': 'p3'}) IF NOT EXISTS;
INSERT INTO Items (id, name, producer, category, price, params) VALUES (8, 'Item8', 'Producer3', 'Category4', 600, {'param4': '1234'}) IF NOT EXISTS;
INSERT INTO Items (id, name, producer, category, price, params) VALUES (9, 'Item9', 'Producer4', 'Category5', 500, {'param5': '567'}) IF NOT EXISTS;
INSERT INTO Items (id, name, producer, category, price, params) VALUES (10, 'Item10', 'Producer4', 'Category5', 1200, {'param5': '123'}) IF NOT EXISTS;
-- + orders
INSERT INTO orders (order_id, customer, dt, items_list, sum) VALUES (1, 'Customer1', '2020-11-01', [1, 2, 3], 1500) IF NOT EXISTS;
INSERT INTO orders (order_id, customer, dt, items_list, sum) VALUES (2, 'Customer2', '2020-11-01', [4, 5, 6, 7, 8], 4650) IF NOT EXISTS;
INSERT INTO orders (order_id, customer, dt, items_list, sum) VALUES (3, 'Customer3', '2020-11-02', [5, 8, 10], 2800) IF NOT EXISTS;
INSERT INTO orders (order_id, customer, dt, items_list, sum) VALUES (4, 'Customer4', '2020-11-03', [1, 2], 800) IF NOT EXISTS;
INSERT INTO orders (order_id, customer, dt, items_list, sum) VALUES (5, 'Customer5', '2020-11-04', [10], 1200) IF NOT EXISTS;
INSERT INTO orders (order_id, customer, dt, items_list, sum) VALUES (6, 'Customer5', '2020-11-05', [5], 1000) IF NOT EXISTS;
