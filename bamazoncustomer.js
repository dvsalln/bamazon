
const mysql = require("mysql");
const inquirer = require(`inquirer`);
const divider = `\n------------------------------------------------------------\n`;


let connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon",
});


const showWelcome = () => {
    console.log(`${divider}\t\tBAMAZON SUPERMARKET${divider}`);
};

const showProducts = () => {
    let query = "SELECT item_id, product_name, price FROM products";
    connection.query(query, (err, data) => {
        if (err) throw err;
        console.table(data);
        showMenu();
    });
};

const showMenu = () => {
    inquirer.prompt([
        {
            type: "input",
            message: "Product ID: ",
            name: "id",
            validate: (ui) => {
                return isNaN(ui) ? "Error: ID must be a number" : true;
            }
        },
        {
            type: "input",
            message: "Quantity: ",
            name: "quantity",
            validate: (ui) => {
                return isNaN(ui) ? "Error: Quantity must be a number" : true;
            }
        }
    ]).then(input => {
        processOrder(input);
    });
};

const processOrder = (input) => {

    let query = `SELECT stock_quantity, price, product_sales FROM products WHERE item_id = ?`;
    connection.query(query, [input.id], (err, data) => {
        if (err) throw err;
        let stock = parseInt(data[0].stock_quantity);
        let quantity = parseInt(input.quantity);
        let success = stock >= quantity;
        if (success) {
            console.log("Order Approved");
            let productSales = parseFloat(data[0].product_sales);
            let totalCost = parseFloat(data[0].price) * quantity;
            query = "UPDATE products SET ?,? WHERE ?";
            connection.query(query,
                [
                    {
                        stock_quantity: stock - quantity
                    },
                    {
                        product_sales: productSales ? productSales + totalCost : totalCost
                    },
                    {
                        item_id: input.id
                    }
                ], (err, newData) => {
                    if (err) throw err;
                    totalCost = totalCost.toFixed(2);
                    console.log(`Total Order Cost: \$${totalCost}`);
                    console.log(divider);
                });
        }
        else {
            console.log("Insufficient stock!");
            console.log(divider);
        }
        connection.end();
    });
};

connection.connect(error => {
    if (error) throw error;
    showWelcome();
    showProducts();
    // connection.end();
});
