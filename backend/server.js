const express = require("express");
const cors = require("cors");
const fs = require("fs");
const csvParser = require("csv-parser");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

const USERS_CSV_PATH = "data/users.csv";

const PRODUCTS_CSV_PATH = "data/products.csv";

// Function to read users from CSV
function getUsers() {
    return new Promise((resolve) => {
        const users = [];
        fs.createReadStream(USERS_CSV_PATH)
            .pipe(csvParser())
            .on("data", (row) => users.push(row))
            .on("end", () => resolve(users));
    });
}

// Function to write updated users to CSV
// function writeUsers(users) {
//     const csvHeader = "email,password,wallet,cart,checkout\n";
//     const csvData = users.map(user =>
//         `${user.email},${user.password},${user.wallet},"${user.cart}","${user.checkout}"`
//     ).join("\n");

//     fs.writeFileSync(USERS_CSV_PATH, csvHeader + csvData, "utf8");
// }

function writeUsers(users) {
    const csvHeader = "email,password,wallet,cart,checkout\n";
    const csvData = users.map(user =>
        `${user.email},${user.password},${user.wallet},"${user.cart}","${user.checkout}"`
    ).join("\n");

    fs.writeFileSync(USERS_CSV_PATH, csvHeader + csvData, "utf8");
}

// function writeUsers(users) {
//     const csvHeader = "email,password,wallet,cart,checkout\n";
//     const csvData = users.map(user =>
//         `${user.email},${user.password},${user.wallet},"${JSON.stringify(user.cart).replace(/"/g, '""')}","${(user.checkout || "").replace(/"/g, '""')}"`
//     ).join("\n");

//     fs.writeFileSync(USERS_CSV_PATH, csvHeader + csvData, "utf8");
// }

// API: User Login
app.post("/login", async (req, res) => {
    console.log("Login request received:", req.body);
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Missing email or password" });
    }

    const users = await getUsers();
    const user = users.find(u => u.email.trim() === email.trim() && u.password.trim() === password.trim());

    if (user) {
        res.json({ 
            success: true, 
            email: user.email, 
            wallet: parseFloat(user.wallet), 
            cart: user.cart || "", 
            checkout: user.checkout || "" 
        });
    } else {
        res.status(401).json({ success: false, message: "Invalid email or password" });
    }
});


// Function to read products from CSV and format data
function getProducts() {
    return new Promise((resolve) => {
        const products = [];
        fs.createReadStream(PRODUCTS_CSV_PATH)
            .pipe(csvParser())
            .on("data", (row) => {
                products.push({
                    id: row.Title.replace(/\s+/g, "-").toLowerCase(), // Unique ID
                    title: row.Title,
                    category: row.Category,
                    shortDescription: row["Short Description"],
                    price: parseFloat(row["Realistic Price"]) || parseFloat(row.Price),
                    sustainabilityScore: parseFloat(row["Sustainability Score"]),
                    ecoLabel: parseFloat(row["Sustainability Score"]) >= 7, // True if score is 7 or above
                    sustainableTitle: row["Sustainable Title"],
                    longDescription: row["Long Description"] || "No description available.", // ✅ Fix
                });
            })
            .on("end", () => resolve(products));
    });
}


// API to fetch all products
app.get("/products", async (req, res) => {
    const products = await getProducts();
    res.json(products);
});

// API to fetch products by category
app.get("/products/:category", async (req, res) => {
    const category = req.params.category;
    const products = await getProducts();
    const filteredProducts = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    res.json(filteredProducts);
});

// Checkout API (Updates wallet balance and clears cart)
app.post("/checkout", async (req, res) => {
    const { email, cart, totalPrice } = req.body;
    const users = await getUsers();

    const userIndex = users.findIndex(u => u.email === email);
    if (userIndex === -1) {
        return res.status(404).json({ success: false, message: "User not found" });
    }

    let userWallet = parseFloat(users[userIndex].wallet);

    if (userWallet < totalPrice) {
        return res.status(400).json({ success: false, message: "Insufficient wallet balance" });
    }

    // Deduct wallet
    users[userIndex].wallet = (userWallet - totalPrice).toFixed(2);

    // Append to checkout field
    const prevCheckout = users[userIndex].checkout || "";
    const newCheckout = cart.map(item => `${item.id}:${item.count}`).join(",");

    users[userIndex].checkout = prevCheckout
        ? `${prevCheckout},${newCheckout}`
        : newCheckout;

    // Clear cart
    users[userIndex].cart = ""; // Will be written as "" in CSV

    writeUsers(users);

    res.json({ success: true, message: "Checkout successful!", wallet: users[userIndex].wallet });
});


app.post("/update-cart", async (req, res) => {
    const { email, cart } = req.body;

    try {
        const users = await getUsers();

        for (let i = 0; i < users.length; i++) {
            if (users[i].email === email) {
                users[i].cart = cart ? JSON.stringify(cart).replace(/"/g, '""') : "";
                break;
            }
        }

        writeUsers(users);
        res.json({ message: "Cart updated." });
    } catch (error) {
        console.error("Failed to update cart:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});


  

// Default route for debugging
app.get("/", (req, res) => {
    res.send("Server is running");
});

const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
