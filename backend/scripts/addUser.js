const mongoose = require("mongoose");
const User = require("../models/user");

const MONGODB_URI = "mongodb+srv://csawant:CsGuNZ1yEXlmWNO0@cluster0.jbttycj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log(" Connected to MongoDB"))
  .catch(err => console.error(" Connection error:", err));

// Create a new user
const newUser = new User({
  email: "chinmayee@gmail.com",
  password: "1234",
  wallet: 100.00,
  cart: [],
  checkout: []
});

// Save the user to the database
newUser.save()
  .then(user => {
    console.log("User created successfully:", user);
    mongoose.disconnect(); // Close connection after saving
  })
  .catch(err => {
    console.error("Error saving user:", err);
    mongoose.disconnect();
  });
