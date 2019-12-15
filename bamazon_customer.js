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
    colWidths: [6, 40, 15, 15, 30],
    // style : {'padding-left': 1,
    // 'padding-right': 1,
  
    border: ['black']
});
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
    displayItems(function(returnValue){
        table.push(
            // displayItems()
            returnValue
        );
    });

   console.log(table.toString());
});

function displayItems(cb){
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.log(res);
            cb(res);
        connection.end();
      });
}

// function promptCustomer(){
//     inquirer
//     .prompt({
//       name: "product",
//       type: "input",
//       message: "What is the ID of the item you would like to purchase?"
//     },
//     {
//         name: "quantity",
//         type: "input",
//         message: "How any would you like?"   
//     }).then (function(id){
//         if(id.product === )

//     });
// }