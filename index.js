const config = require("./configuration.json");

//Modules
const express = require("express");

const db = require("./Database");
//Routes
const register = require("./Routers/register");

app = express()

//Middlewares
app.use(express.json());

//Setting up routes
app.use("/register", register);

//Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Server Error!!");
});

//Listen
PORT = process.env.PORT || parseInt(config.PORT);

db.connect((err) => {
  if (err) {
    console.log("Couldn't Connect to the Database!!");
    console.log("DB Error: ", err);
  } else {
    app.listen(PORT, () => {
      console.log(`Server started at port ${PORT}`);
    });
  }
});
