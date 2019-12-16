var inquirer = require('inquirer');
var Table = require('cli-table');
var mysql = require("mysql");

var table = new Table({
    chars: {
        'top': '─', 'top-mid': '┬', 'top-left': '┌', 'top-right': '┐'
      , 'bottom': '─', 'bottom-mid': '┴', 'bottom-left': '└', 'bottom-right': '┘'
      , 'left': '│', 'left-mid': '├'
      , 'mid': '─', 'mid-mid': '┼'
      , 'right': '│', 'right-mid': '┤'
      , 'middle': '│'
    },
    head: ['ID', 'product_name','department_name', 'price', 'stock_quantity'],
    colWidths: [6, 40, 25, 15, 20],
    // style : {'padding-left': 1,
    // 'padding-right': 1,
  
    border: ['black']
});
// var table = new Table();
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
    promptCustomer();
  });

function promptCustomer(){
    inquirer
    .prompt([{
      type: "rawlist",
      message: "What would you like to do?",
      choices: ["View Products for Sale","View Low Inventory","Add to Inventory","Add New Product"],
      name: "managerChoice"
    }]).then (function(info){
        // console.log(info);
        if(info.managerChoice == "View Products for Sale"){
            viewProducts();
        }else if(info.managerChoice == "View Low Inventory"){
            lowInventory();
        }else if(info.managerChoice == "Add to Inventory"){
            promptInventory();
        // }else{
        //     addNewInventory();
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


function viewProducts(){
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.log(res);
        
        displayTable(res);
    });
}

function lowInventory(){
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, res) {
        if (err) throw err;
        console.log(res);
        displayTable(res);
    });
}
function addInventory(id, quan){
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [
          {
              stock_quantity: quan
          },
          {
            id: id
          }
        ], function(err, res) {
        if (err) throw err;

         console.log("updated the quantity");
        // table.push(res);
        // console.log(table.toString());
    });
}
function displayTable(res){
    for( var i = 0; i < res.length; i++){
        table.push([res[i].id, res[i].product_name,res[i].department_name,res[i].price,res[i].stock_quantity]);
    }
    
    console.log(table.toString());
}