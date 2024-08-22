const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");
const colors = require("colors");

colors.enable();

const client = new MongoClient("mongodb://localhost:27017/");
client.connect().then(async () => {
  const admin = client.db().admin();
  const databases = await admin.listDatabases();
  const dbExists = databases.databases.some((db) => db.name === "testdb");
  if (!dbExists) {
    // await admin.createDatabase("testdb");
    console.log(colors.cyan("<< testdb >>"), colors.red("Database not found"));
  } else {
    console.log(
      colors.cyan("<< testdb >>"),
      colors.green("Database already exists")
    );
    mongoose.connect("mongodb://localhost:27017/testdb");
    mongoose.connection.on("connected", () => {
      console.log("Connected to MongoDB");
    });
    mongoose.connection.on("error", (err) => {
      console.log("Error connecting to MongoDB", err);
    });
  }
});

module.exports = mongoose;
