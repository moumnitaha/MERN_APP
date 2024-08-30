const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: [String],
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
  quantity: {
    type: Number,
    required: true,
  },
  rates: {
    type: Number,
    default: 0,
  },
  orders: {
    type: Number,
    default: 0,
  },
  refunds: {
    type: Number,
    default: 0,
  },
  updatedAt: {
    type: Date,
    default: () => new Date(),
  },
  category: {
    name: String,
    id: Number,
    image: String,
    createdAt: {
      type: Date,
      default: () => new Date(),
    },
    updatedAt: {
      type: Date,
      default: () => new Date(),
    },
  },
});

//edit save() method to update updatedAt
productSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

productSchema.pre("findOneAndUpdate", function (next) {
  this._update.updatedAt = new Date();
  next();
});

productSchema.pre("updateOne", function (next) {
  this._update.updatedAt = new Date();
  next();
});

module.exports = mongoose.model("Product", productSchema);
