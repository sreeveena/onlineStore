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
      choices: ["View Products for Sale","View Low Inventory","Add to Inventory","Add New Product","Show Departments","Quit"],
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
        }else if(info.managerChoice == "Show Departments"){
           showDepartments();
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
    }]).then (function(info){
        if(!isNaN(info.product)){
            promptQuantity(info.product);
        }else{
            console.log("please enter a valid input");
            promptInventory();
        }
    });
}
function promptQuantity(product){
    inquirer
    .prompt([{
        name: "quantity",
        type: "input",
        message: "How many would you like to add?"   
    }]).then (function(info){
        if(!isNaN(info.quantity)){
            addInventory(product,info.quantity);
        }else{
            console.log("please enter a valid input");
            promptQuantity(product);
        }
        
    });
}
//function will prompt the manager about new product and calls addNewProduct function.
function promptNewProduct(){
    connection.query("SELECT department_name FROM departments", function(err, res) {
        if (err) throw err;
        var depts = [];
        for(var i = 0; i < res.length; i++){
           depts[i] = res[i].department_name;
        }
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
            choices: depts  
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
function showDepartments(){
    connection.query("SELECT department_name FROM departments", function(err, res) {
        if (err) throw err;
        displayTable1(res);
    });
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
function displayTable1(res){
    table = new Table({
        head: ['department_name',],
        colWidths: [ 40],
        border: ['black']
    });
    for( var i = 0; i < res.length; i++){
        table.push([res[i].department_name]);
    }
    
    console.log(table.toString());
    promptManager();
}