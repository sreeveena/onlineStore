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
        // connection.end();
        promptCustomer();
      });
}

function promptCustomer(){
    inquirer
    .prompt([{
      name: "product",
      type: "input",
      message: "What is the ID of the item you would like to purchase?"
    },
    {
        name: "quantity",
        type: "input",
        message: "How many would you like?"   
    }]).then (function(id){
        var query = "SELECT id, stock_quantity FROM products WHERE id ="+ id.product;
        // console.log(query);
        // console.log(id.quantity);
        connection.query(query, function(err, res) {
            if (err) throw err;
            // console.log(res);
            // console.log(res[0].stock_quantity);
            // console.log(id.quantity);

            if(id.quantity > res[0].stock_quantity){
                console.log("insufficient quantity");
                displayItems(function(returnValue){
                    table.push(
                        // displayItems()
                        returnValue
                    );
                });
            }else{
                res[0].stock_quantity -= id.quantity;
                console.log(res[0].stock_quantity);
                var id1 = parseInt(id.product);
                updateProduct(res[0].stock_quantity,id1);
                
            }
        });
    });
}
function updateProduct(q,id) {
    var query = connection.query(
      "UPDATE products SET ? WHERE ?",
      [
        {
            stock_quantity: q
        },
        {
          id: id
        }
      ],
      function(err, res) {
        console.log(err);
        displayItems(function(returnValue){
            table.push(
                // displayItems()
                returnValue
            );
        });
      }
    );
}