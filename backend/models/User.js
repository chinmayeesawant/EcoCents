const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
    id: { type: String, required: true },   // product ID or name
    count: { type: Number, required: true } // quantity
}, { _id: false }); // Disable _id for subdocuments

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    wallet: { type: Number, default: 0 },
    cart: { type: [cartItemSchema], default: [] },
    checkout: { type: [cartItemSchema], default: [] }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
