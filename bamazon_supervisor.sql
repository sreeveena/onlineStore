-- DROP DATABASE IF EXISTS bamazonDB;

-- CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE departments (
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(45) NULL,
  over_head_costs INT,
  PRIMARY KEY (department_id)
);

INSERT INTO departments (department_name, over_head_costs, product_sales) VALUES
("electronics", 100 ),("home", 60), 
("toys", 30), ("health", 50),("clothing", 20);