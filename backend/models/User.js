const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],   // ✅ 'require' → 'required'
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"], // ✅ moved inside email field
  },

  password: {
    type: String,
    required: [true, "Password is required"], // ✅ 'require' → 'required'
    minlength: [6, "Password must be at least 6 characters long"],
  },
});

module.exports = mongoose.model("User", userSchema);
