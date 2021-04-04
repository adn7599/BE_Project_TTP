const mongoose = require("mongoose");

const config = require("../configuration.json");

mongoose.connect(config.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

mongoose.pluralize(null);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));

module.exports = { db };
