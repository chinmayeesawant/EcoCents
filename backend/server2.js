const express = require("express");
const cors = require("cors");
const fs = require("fs");
const csvParser = require("csv-parser");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("./models/user");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

mongoose.connect("mongodb+srv://csawant:CsGuNZ1yEXlmWNO0@cluster0.jbttycj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));

// loading the product csv
const PRODUCTS_CSV_PATH = "data/products.csv";

// API: User Login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Missing email or password" });
    }

    const user = await User.findOne({ email: email.trim(), password: password.trim() });

    if (user) {
        res.json({
            success: true,
            email: user.email,
            wallet: user.wallet,
            cart: user.cart || [],
            checkout: user.checkout || []
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

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.wallet < totalPrice) {
        return res.status(400).json({ success: false, message: "Insufficient wallet balance" });
    }

    // Deduct wallet and append cart to checkout
    user.wallet -= totalPrice;
    user.checkout = [...user.checkout, ...cart];
    user.cart = [];
    await user.save();

    res.json({ success: true, message: "Checkout successful!", wallet: user.wallet.toFixed(2) });
});


app.post("/update-cart", async (req, res) => {
    const { email, cart } = req.body;

    try {
        await User.findOneAndUpdate(
            { email },
            { cart: cart || [] }
        );
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

// const PORT = 5001;
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));