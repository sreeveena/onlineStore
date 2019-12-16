var inquirer = require('inquirer');
var Table = require('cli-table');
var mysql = require("mysql");
var table;
 

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "bamazonDB"
});
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    promptManager();
  });
//Prompts the manager  
function promptManager(){
    inquirer
    .prompt([{
      type: "rawlist",
      message: "What would you like to do?",
      choices: ["View Products for Sale","View Low Inventory","Add to Inventory","Add New Product","Quit"],
      name: "managerChoice"
    }]).then (function(info){
        if(info.managerChoice == "View Products for Sale"){
            viewProducts();
        }else if(info.managerChoice == "View Low Inventory"){
            lowInventory();
        }else if(info.managerChoice == "Add to Inventory"){
            promptInventory();
        }else if(info.managerChoice == "Add New Product"){
            promptNewProduct();
        }else{
            connection.end();
        }
        
    });
}

function promptInventory(){
    inquirer
    .prompt([{
    name: "product",
    type: "input",
    message: "What is the ID of the item you would like to add?"
  },
  {
      name: "quantity",
      type: "input",
      message: "How many would you like to add?"   
  }]).then (function(info){
    addInventory(info.product,info.quantity);
    });
}
//function will prompt the manager about new product and calls addNewProduct function.
function promptNewProduct(){
    inquirer
    .prompt([{
    name: "product",
    type: "input",
    message: "What is the name of the product you would like to add?",
  },
  {
      name: "department",
      type: "rawlist",
      message: "Which department does this item belong to?",
      choices: ["electronics", "home", "toys","health","clothing"]   
  },{
      name: "cost",
      type: "input",
      message: "how much does it cost?"
  },
  {
    name: "quantity",
    type: "input",
    message: "how many do we have?"
   
}]).then (function(info){
    addNewProduct(info.product,info.department,info.cost,info.quantity);
    });
}
// displays all the columns from  products table
function viewProducts(){
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        displayTable(res);
        promptManager();
    });
}
// displays all the columns from products whose quantity is less then 5 
function lowInventory(){
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, res) {
        if (err) throw err;
        displayTable(res);
        promptManager();
    });
}
//adds the  quantity entered by manager to the existing quantity.
function addInventory(id, quan){
    var quantity = 0;
    connection.query("SELECT stock_quantity FROM products WHERE id="+id, function(err, res) {
        if (err) throw err;
        if(res.length == 0){
            console.log("Please enter a valid product id.");
            promptManager();
        }else{
            quantity = res[0].stock_quantity + parseInt(quan);
            connection.query(
            "UPDATE products SET ? WHERE ?",
            [
            {
                stock_quantity: quantity
            },
            {
                id: id
            }
            ], function(err, res) {
            if (err) throw err;
            console.log("updated the quantity");
            promptManager();
            });
        }
    });
}
//adds a new product tot he products table.
function addNewProduct(pro,dep,cost,quan){
    var query = connection.query(
        "INSERT INTO products SET ?",
        {
          product_name: pro,
          department_name: dep,
          price: cost,
          stock_quantity: quan
        },
        function(err, res) {
            if (err) throw err;
            console.log("Added new product");
            promptManager();
        }
    );
}

function displayTable(res){
    table = new Table({
        head: ['ID', 'product_name','department_name', 'price', 'stock_quantity'],
        colWidths: [6, 40, 25, 15, 20],
        border: ['black']
    });
    for( var i = 0; i < res.length; i++){
        table.push([res[i].id, res[i].product_name,res[i].department_name,res[i].price,res[i].stock_quantity]);
    }
    
    console.log(table.toString());
}