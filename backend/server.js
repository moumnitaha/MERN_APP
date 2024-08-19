const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("./configs/dbConfig");
const User = require("./models/user");
const cors = require("cors");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const colors = require("colors");
const allRoutes = require("./routes/allRoutes");
colors.enable();

const ACCESS_TOKEN_SECRET = "+y0ur4cc3sst0k3ns3cr3t+";
const REFRESH_TOKEN_SECRET = "+y0urR3fr3sht0k3ns3cr3t+";

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

app.get("/users", async (req, res) => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    console.log(colors.red("Access denied"));
    return res.status(401).send("Access denied");
  }
  let user;
  try {
    const verified = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
    console.log(verified);
    user = await User.findById(verified.userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
  } catch (err) {
    return res.status(401).send("Access denied!");
  }
  console.log(colors.green(`Welcome to the homepage ${user.name}`));
  const users = User.find()
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      res.json(err);
    });
});

app.use("/", allRoutes);
