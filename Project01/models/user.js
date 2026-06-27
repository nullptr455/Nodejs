const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/testapp1")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  image: String
});

module.exports = mongoose.model("user", userSchema);