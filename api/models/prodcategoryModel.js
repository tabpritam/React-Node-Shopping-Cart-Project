const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var prodcategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    image: {
      type: String,
      required: false, // You can set this to true if an image is always required
    },
  },
  {
    timestamps: true,
  }
);

// Export the model
module.exports = mongoose.model("pCategory", prodcategorySchema);
