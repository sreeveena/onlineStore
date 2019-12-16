var inquirer = require('inquirer');
var Table = require('cli-table');
var mysql = require("mysql");

var table = new Table({
    head: ['ID', 'product_name','department_name', 'price', 'stock_quantity'],
    colWidths: [6, 40, 25, 15, 20],
    border: ['black']
});
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazonSuperDB"
  });
  connection.connect(function(err) {
      if (err) throw err;
      console.log("connected as id " + connection.threadId + "\n");
      promptSupervisor();
    });

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

        });
    }