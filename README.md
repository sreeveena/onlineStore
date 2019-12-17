# onlineStore

Technologies used:
1. MYSQL
2. node js

In this project we have three javascript file and two sql tables which is a bash program. This project is almost any online shoping site with multiple sql queries which help customers, manager and supervisor as well.
The first table for customers and manager has a products table with following columns:
1. item_id (unique id for each product)
2. product_name (Name of product)
3. department_name
4. price (cost to customer)
5. stock_quantity (how much of the product is available in stores)

For customers: 

1. the application will prompt the ID of the product they would like to buy and how many units of the product they would like to buy.
2. check if your store has enough of the product to meet the customer's request.
3. If the app doesn't have enough of the product, then log a phrase like `Insufficient quantity!`
4. If the app does have enough of the product, then it updates the SQL database and show the customer the total cost of their purchase.

For manager: 

