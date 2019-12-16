var inquirer = require('inquirer');
var Table = require('cli-table');
var mysql = require("mysql");

var table ;
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
        displayTable(returnValue);
    });
});
//display all the items in products table
function displayItems(cb){
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
            cb(res);
        promptCustomer();
      });
}
//prompts the customer 
function promptCustomer(){
    inquirer
    .prompt([{
      name: "product",
      type: "input",
      message: "What is the ID of the item you would like to purchase (Quit with Q)?"
    },
    {
        name: "quantity",
        type: "input",
        message: "How many would you like (Quit with Q)?"   
    }]).then (function(id){
            if(id.quantity.toUpperCase() == "Q" || id.product.toUpperCase() == "Q"){
                connection.end();
            }else{
                var query = "SELECT id, stock_quantity FROM products WHERE id ="+ id.product;
                connection.query(query, function(err, res) {
                if (err) throw err;
                if(id.quantity > res[0].stock_quantity){
                    console.log("insufficient quantity");
                    displayItems(function(returnValue){
                        displayTable(returnValue);
                    });
                }else{
                    res[0].stock_quantity -= id.quantity;
                    // updateProductsSales(id.quantity, id.product);
                    var id1 = parseInt(id.product);
                    updateProduct(res[0].stock_quantity,id.quantity,id1);
                }
            });
        }   
    });
}
//updated the stock_quantity related to the id in products table
function updateProduct(q,ps,id) {
    var query = connection.query(
      "UPDATE products SET ?,? WHERE ?",
      [
        {
            stock_quantity: q
        },{
            product_sales: ps
        },
        {
          id: id
        }
      ],
      function(err, res) {
       if(err) throw err;
        displayItems(function(returnValue){
            displayTable(returnValue);
        });
      }
    );
}
// function updateProductsSales(q,id){
//     var query = connection.query(
//         "UPDATE products SET ? WHERE ?",
//         [
//           {
//             product_sales: q
//           },
//           {
//             id: id
//           }
//         ],
//         function(err, res) {
//          if(err) throw err;
//           displayItems(function(returnValue){
//               displayTable(returnValue);
//           });
//         }
//     );
// }
// this function will display the items in the cli-table.
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