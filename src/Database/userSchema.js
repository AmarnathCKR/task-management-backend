const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    image : String,
    google : Boolean,
    status: Boolean,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
