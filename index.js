const config = require("./configuration.json");

//Modules
const express = require("express");

const db = require("./Models");
//Routes
const register = require("./Routers/register");

app = express();

//Middlewares
app.use(express.json());

//Setting up routes
app.use("/register", register);

//Error Handler
app.use((err,req,res,next)=>{
    console.error(err.stack);
    res.status(500).send('Server Error!!')
});

//Listen
PORT = process.env.PORT || parseInt(config.PORT);
if (db.isDbConnected()) {
    /*
    db.sequelize.sync().then(()=>{
        console.log("Sequelized")
    }).catch(error => {
        console.log("DB Sync Error",error)
    })
    */
    app.listen(PORT, () => {
        console.log(`Server started at port ${PORT}`);
    });
}
