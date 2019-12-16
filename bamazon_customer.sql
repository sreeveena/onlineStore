DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products (
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(45) NULL,
  department_name VARCHAR(45) NULL,
  price DECIMAL(8,2),
  stock_quantity INT,
  product_sales INT DEFAULT 0,
  PRIMARY KEY (id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES
("Echo show", "electronics", 59.99, 5),("fitbit watch", "electronics", 99.99, 4),
("5 piece Queen size bedding", "home", 49.99, 2), ("Corelle dinnerware", "home", 89.99, 3),
("STEM Snap circuits", "toys", 19.99, 8), ("foot massager", "health", 86.67, 6),
("Winter Thermal Gloves", "clothing", 16.99, 9), ("Dancing water speakers", "electronics", 27.99, 5),
("Ring video doorbell", "electronics", 139.00, 5), ("stainless steel metal straws", "home", 7.99, 12);

select * from products;