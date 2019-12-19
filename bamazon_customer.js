var inquirer = require('inquirer');
var Table = require('cli-table');
var mysql = require("mysql");
var maxProduct = 0;
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
    }]).then (function(id){
        if(id.product.toUpperCase() == "Q"){
            connection.end(); 
        }else{
            if(parseInt(id.product) <= maxProduct){
                promptQuantity(id.product);
            }else{
                console.log("please enter a valid input");
                promptCustomer();
            }
            
        }
    });
}
    function promptQuantity(product){
        inquirer
        .prompt([{
        name: "quantity",
        type: "input",
        message: "How many would you like (Quit with Q)?"   
    }]).then (function(id){
            if(id.quantity.toUpperCase() == "Q"){
                connection.end();
            }else{
                var query = "SELECT id, stock_quantity, product_sales,price FROM products WHERE id ="+ product;
                connection.query(query, function(err, res) {
                if (err) throw err;
                if(!isNaN(id.quantity)){                
                    if(id.quantity > res[0].stock_quantity){
                        console.log("insufficient quantity");
                        promptQuantity(product);
                    }else{
                        res[0].stock_quantity -= id.quantity;
                        res[0].product_sales += parseInt(id.quantity);
                        // updateProductsSales(id.quantity, id.product);
                        var id1 = parseInt(product);
                        var sales = res[0].product_sales + parseFloat(id.quantity)*res[0].price;
                        updateProduct(res[0].stock_quantity,sales,id1,id.quantity);
                    }
                }else{
                    console.log("please enter a valid input");
                    promptQuantity(product);
                }
            });
        }   
    });
}
//updated the stock_quantity related to the id in products table
function updateProduct(q,ps,id,purchasedQuantity) {
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
        
        var cliTableProductEntry = table.find( function(entry) {
            if(entry[0] == id) {
                return true;
            }
            return false;
        });
        console.log("Sucessfully purchased " + purchasedQuantity + " " + cliTableProductEntry[1]+"'s");
        
        displayItems(function(returnValue){
            displayTable(returnValue);
        });
      }
    );
}
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
    maxProduct = i;
    console.log(table.toString());
}