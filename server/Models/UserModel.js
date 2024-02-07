const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Your email address is required"],
    unique: true,
  },
  mobile: {
    type: String,
    default: ""
  },
  username: {
    type: String,
    required: [true, "Your username is required"],
  },
  fullname: {
    type: String,
    default: ""
  },
  telehandle: {
    type: String,
    default: ""
  },
  birthYear: {
    type: String,
    default: ""
  },
  gender: {
    type: String,
    default: ""
  },
  currentStatus: {
    type: String,
    default: ""
  },
  location: {
    type: String,
    default: ""
  },
  password: {
    type: String,
    required: [true, "Your password is required"],
  },
  role: {
    type: String,
    enum: ["Volunteer", "Admin"],
    default: "Volunteer",
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  }
});

userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 12);
});

module.exports = mongoose.model("User", userSchema);