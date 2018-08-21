

const mysql = require("mysql");
const cTable = require('console.table');
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
    console.log(`${divider}\t\tBAMAZON SUPER - Manager View${divider}`);
}

const showProducts = () => {
    let query = "SELECT * FROM products";
    connection.query(query, (err, data) => {
        if (err) throw err;
        console.table(data);
        console.log(divider);
        showMenu();
    });
}

const showLowInventory = () => {
    let query = "SELECT * FROM products WHERE stock_quantity <= 5";
    connection.query(query, (err, data) => {
        if (err) throw err;
        console.table(data);
        console.log(divider);
        showMenu();
    });
}

const addInventory = () => {
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
        updateInventory(input);
    });

}

const updateInventory = (input) => {


    let query = "SELECT stock_quantity FROM products WHERE item_id = ?";
    connection.query(query, [input.id], (err, data) => {
        if (err) throw err;
        let stock = parseInt(data[0].stock_quantity);
        let quantity = parseInt(input.quantity);
        query = `UPDATE products SET ? WHERE ?`;
        connection.query(query,
            [
                {
                    stock_quantity: stock + quantity
                },
                {
                    item_id: input.id
                }
            ], (err, newData) => {
                if (err) throw err;
                // console.log(`${newData.affectedRows} product updated!`);
                console.log(`\tProduct Inventory updated!`);
                console.log(divider);
                showMenu();
            });
    });
}

const addProduct = () => {
    inquirer.prompt([
        {
            type: "input",
            message: "Product Name: ",
            name: "name",
        },
        {
            type: "input",
            message: "Department Name: ",
            name: "department",
        },
        {
            type: "input",
            message: "Price: \$",
            name: "price",
            validate: (ui) => {
                return isNaN(ui) ? "Error: Price must be a number" : true;
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
        createProduct(input);
    });
}


const createProduct = (input) => {
    let query = `INSERT INTO products (product_name, department_name, price, stock_quantity)
    VALUES (?,?,?,?)`;
    connection.query(query, [
        input.name,
        input.department,
        input.price,
        input.quantity
    ], (err, data) => {
        if (err) throw err;
        console.log(`\t Product Added!`);
        console.log(divider);
        showMenu();
    });
}


const showMenu = () => {
    inquirer.prompt([
        {
            type: "list",
            message: "Select an option: ",
            name: "option",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
        }
    ]).then(input => {

        switch (input.option) {
            case "View Products for Sale":
                showProducts();
                break;
            case "View Low Inventory":
                showLowInventory();
                break;
            case "Add to Inventory":
                addInventory();
                break;
            case "Add New Product":
                addProduct();
                break;
            case "Exit":
                connection.end();
                console.log("Good Bye!\n");
                break;
        }
    });
}




connection.connect(error => {
    if (error) throw error;
    showWelcome();
    showMenu();
});