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
    viewProducts();
});

function promptSupervisor(){
    inquirer
    .prompt([{
        name: "product",
        type: "rawlist",
        message: "What would you like to do?",
        choices: ['View Product Sales by Department','Create New Department','Quit']
    }]).then (function(id){
        if(id.product == "View Product Sales by Department"){
            viewdepartments();
        }
        // }else if(id.product == "Create New Department"){
        //     promptDepart();
        // }
        else{
            connection.end();
        }
    });
}
function viewProducts(){
connection.query("SELECT id,product_name, product_sales, products.department_name, price, stock_quantity FROM products,departments WHERE products.department_name = departments.department_name", 
    function(err, res){
    if (err) throw err;
        displayTable1(res);
        promptSupervisor();
    });
}
function viewdepartments(){
    connection.query("select department_id, departments.department_name, over_head_cost, p.product_sales, (p.product_sales - departments.over_head_costs) as total_profit from departments, (select department_name, sum(product_sales) as product_sales from products group by department_name) as p where p.department_name = departments.department_name"
    , function(err, res){
        if (err) throw err;
            displayTable2(res);
            promptSupervisor();
    });
}
function sumOfSales(){
    connection.query("SELECT sum(product_sales), department_name FROM products GROUP BY department_name", 
    function(err, res){
    if (err) throw err;
        // console.log(res);
    });
}

function displayTable1(res){
    table = new Table({
        head: ['item_id', 'product_name','product_sales', 'department_name', 'price','stock_quantity'],
        colWidths: [6, 45, 15, 25, 10, 15],
        border: ['black']
    });
    for( var i = 0; i < res.length; i++){
        table.push([res[i].id, res[i].product_name,res[i].product_sales,res[i].department_name,res[i].price,res[i].stock_quantity]);
    }
    
    console.log(table.toString());
}
function displayTable2(res){
    table = new Table({
        head: ['department_id', 'department_name','over_head_cost', 'product_sales', 'total_profit'],
        colWidths: [6, 40, 25, 15, 10],
        border: ['black']
    });
    for( var i = 0; i < res.length; i++){
        table.push([res[i].department_id, res[i].department_name,res[i].over_head_cost,res[i].product_sales,res[i].total_profit]);
    }
    
    console.log(table.toString());
}