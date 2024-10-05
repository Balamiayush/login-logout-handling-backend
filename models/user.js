const mongoose = require("mongoose");

// Connect to MongoDB
let url =
  "mongodb+srv://aryanbalami54:t24gtz4t1lRgxU4M@cluster0.hywn2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Define a schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Create a model
module.exports = mongoose.model("user", userSchema);
