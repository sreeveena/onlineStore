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
        
    });
}