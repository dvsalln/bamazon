
DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products(
	item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR (50) NOT NULL,
    department_name VARCHAR (50),
    price FLOAT (8,3),
    stock_quantity INT,
    product_sales FLOAT(10,3),
    PRIMARY KEY(item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("soap", "body care", 1.5, 100),
	("diet coke", "sodas", .65, 500),
    ("rice", "seeds", 3, 34),
    ("jumbo shrimp", "frozen foods", 20, 300),
    ("doritos", "snacks", 2.99, 15),
    ("ground beef", "meats", 10, 20),
    ("lime juice", "condiments", 4.99, 2),
    ("sky vodka", "alcohol", 12.95, 80),
    ("greek yogurt", "dairy", 6, 72),
    ("salame", "cold cuts", 18, 50);
    
SELECT * FROM products;
-- SELECT stock_quantity FROM products WHERE item_id = 2;


CREATE TABLE departments (
	department_id INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(50),
    over_head_costs FLOAT(10,3),
    PRIMARY KEY(department_id)
);
    
    
		