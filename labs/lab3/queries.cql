USE lab3;

--Напишіть запит, який показує структуру створеної таблиці (команда DESCRIBE)
DESCRIBE items;


-- Напишіть запит, який виводить усі товари в певній категорії 
-- відсортовані за ціною
select *
from items
where category='Category1'
order by price;


-- Напишіть запити, які вибирають товари за різними критеріями в межах певної категорії:
-- + назва
select * from items
where category='Category1' and name='Item1';
-- + ціна (в проміжку)
SELECT * FROM items
WHERE category = 'Category5' AND price > 400 AND price < 1200;
-- + виробник
SELECT * FROM items
WHERE category = 'Category2' AND producer = 'Producer3' AND price = 800;


-- Напишіть запити, які вибирають товари за:
-- + наявність певних характеристик
SELECT * FROM items
WHERE category = 'Category1' AND params CONTAINS KEY 'param1';
-- + певна характеристика та її значення
SELECT * FROM items
WHERE category = 'Category1' AND params['param1'] = '2';


-- Оновити опис товару
-- + змінить існуючі значення певної характеристики 
UPDATE items
SET params['param4'] = '1234567'
WHERE category = 'Category4' and price = 600 and id = 8;
-- + додайте нові властивості (характеристики) товару
UPDATE items
SET params['new_param'] = 'param'
WHERE category = 'Category4' and price = 600 and id = 8;
-- + видалить характеристику товару
UPDATE items
SET params['new_param'] = NULL
WHERE category = 'Category4' and price = 600 and id = 8;


-- Напишіть запит, який показує структуру створеної таблиці (команда DESCRIBE)
DESCRIBE orders;


-- Для замовника виведіть всі його замовлення відсортовані за часом коли вони були зроблені
SELECT* FROM orders
WHERE customer = 'Customer5' ORDER BY dt;


-- Для замовника знайдіть замовлення з певним товаром
SELECT * FROM orders
WHERE customer = 'Customer5' AND items_list CONTAINS 5;


-- Для замовника знайдіть замовлення за певний період часу і їх кількість
SELECT COUNT(*) FROM orders
WHERE customer = 'Customer5' AND dt > '2020-11-03';


-- Для кожного замовників визначте середню вартість замовлення
SELECT customer, AVG(sum) FROM orders
GROUP BY customer;


-- Для кожного замовників визначте суму на яку були зроблені усі його замовлення
SELECT customer, SUM(sum) FROM orders
GROUP BY customer;


-- Для кожного замовників визначте замовлення з максимальною вартістю
SELECT customer, MAX(sum) FROM orders
GROUP BY customer;


-- Модифікуйте певне замовлення додавши / видаливши один або кілька товарів при цьому також змінюючи вартість замовлення
UPDATE orders
SET items_list = items_list + [2], sum = 1500
WHERE customer = 'Customer5' and dt='2020-11-05' and order_id=6;


-- Для кожного замовлення виведіть час коли його ціна були занесена в базу (SELECT WRITETIME)
SELECT customer, sum, dt, WRITETIME(sum) FROM orders;


-- Створіть замовлення з певним часом життя (TTL), після якого воно видалиться
INSERT INTO orders (order_id, customer, sum, dt, items_list) VALUES (7, 'Customer7', 300, '2020-11-14', [1]) USING TTL 1000000;


-- Поверніть замовлення у форматі JSON
SELECT json order_id, customer, sum, dt, items_list FROM orders;


-- Додайте замовлення у форматі JSON
INSERT INTO orders JSON '{
    "order_id": 8,
    "customer": "Customer8",
    "sum": 300,
    "dt": "2020-11-13",
    "items_list": [1]
}';
