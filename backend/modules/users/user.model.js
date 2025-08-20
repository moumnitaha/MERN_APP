const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  age: Number,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  avatar: String,
  hobbies: [String],
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
  updatedAt: {
    type: Date,
    default: () => new Date(),
  },
  password: {
    type: String,
    required: true,
  },
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  cart: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: {
        type: Number,
        default: 1,
        required: true,
      },
    },
  ],
  refreshToken: {
    type: String,
  },
  verificationToken: {
    type: String,
  },
});

const removeFromFriends = async function (next) {
  if (this.friends && this.friends.length) {
    for (const friend of this.friends) {
      await this.model.findByIdAndUpdate(friend, {
        $pull: { friends: this._id },
      });
    }
  }
  next();
};

userSchema.pre("remove", removeFromFriends);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
