const config = require("./configuration.json");

//Modules
const express = require("express");
const morgan = require("morgan");

const { db } = require("./Models");
//Routes
const user = require("./Routers/User");
const relay = require("./Routers/Relay");

const app = express();

//Middlewares
app.use(morgan("tiny"));
app.use(express.json());

//Setting up routes
app.use("/user", user);
app.use("/relay", relay);

//Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Server Error!!");
});

//Listen
PORT = process.env.PORT || parseInt(config.PORT);

db.once("open", () => {
  console.log("MongoDB Database connected!!");
  app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
  });
});
