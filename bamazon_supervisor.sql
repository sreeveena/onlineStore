DROP DATABASE IF EXISTS bamazonSuperDB;

CREATE DATABASE bamazonSuperDB;

USE bamazonSuperDB;

CREATE TABLE departments (
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(45) NULL,
  over_head_costs INT
  PRIMARY KEY (department_id)
);