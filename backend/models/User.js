const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,

    email: {
      type: String,
      unique: true,
    },

    password: String,

    role: {
      type: String,
      enum: ["user", "recruiter", "admin"],
      default: "user",
    },

    resume: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);