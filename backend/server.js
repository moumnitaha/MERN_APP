const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("./configs/dbConfig");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const colors = require("colors");
const allRoutes = require("./routes/allRoutes");
const bodyParser = require("body-parser");

require("dotenv").config();

app.use(cookieParser());

colors.enable();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(express.json());

app.listen(port, () => {
  console.clear();
  console.log(`Server is running on http://localhost:${port}`);
});

app.use("/", allRoutes);
