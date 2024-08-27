const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
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
  refreshToken: {
    type: String,
  },
  verificationToken: {
    type: String,
  },
});

//edit deleteOne() method to update updatedAt
userSchema.pre("deleteOne", function (next) {
  let friends = this.friends;
  friends.forEach(async (friend) => {
    await User.findByIdAndUpdate(friend, {
      $pull: { friends: this._id },
    });
  });
  next();
});

// all other delete methods
userSchema.pre("deleteMany", function (next) {
  let friends = this.friends;
  friends.forEach(async (friend) => {
    await User.findByIdAndUpdate(friend, {
      $pull: { friends: this._id },
    });
  });
  next();
});

userSchema.pre("findOneAndDelete", function (next) {
  let friends = this.friends;
  friends.forEach(async (friend) => {
    await User.findByIdAndUpdate(friend, {
      $pull: { friends: this._id },
    });
  });
  next();
});

userSchema.pre("findByIdAndDelete", function (next) {
  let friends = this.friends;
  friends.forEach(async (friend) => {
    await User.findByIdAndUpdate(friend, {
      $pull: { friends: this._id },
    });
  });
  next();
});

module.exports = mongoose.model("User", userSchema);
