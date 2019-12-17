# onlineStore

Technologies used:
1. MYSQL
2. node js

In this project we have three javascript file and two sql tables which is a bash program. This project is almost any online shoping site with multiple sql queries which help customers, manager and supervisor as well.

The first table for customers, manager and supervisor has a products table with following columns:
1. item_id (unique id for each product)
2. product_name (Name of product)
3. department_name
4. price (cost to customer)
5. stock_quantity (how much of the product is available in stores)

The second table for supervisor has a departments table with following columns:
1. department_id
2. department_name
3. over_head_costs

For customers: 

1. the application will prompt the ID of the product they would like to buy and how many units of the product they would like to buy.
2. check if your store has enough of the product to meet the customer's request.
3. If the app doesn't have enough of the product, then log a phrase like `Insufficient quantity!`
4. If the app does have enough of the product, then it updates the SQL database and show the customer the total cost of their purchase.

For manager: 

It will prompt the manager for the following options:
1.  View Products for Sale
2. View Low Inventory
3. Add to Inventory
4. Add New Product
If a manager selects `View Products for Sale`, the app will list every available item: the item IDs, names, prices, and quantities.
If a manager selects `View Low Inventory`, then it will list all items with an inventory count lower than five.
If a manager selects `Add to Inventory`, then app will display a prompt that will let the manager "add more" of any item currently in the store.
If a manager selects `Add New Product`, it will allow the manager to add a completely new product to the store.

For Supervisor: 

