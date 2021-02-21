const db = require('.');
const { DataTypes } = require('sequelize') 

const GP_Customer = db.sequelize.define("GP_Customer",{
    Ration_no:{
        type: DataTypes.CHAR(10),
        primaryKey: true,
    },
    First_Name: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    MIDDLE_Name: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    Last_Name: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    Address: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    Mob_no: {
        type: DataTypes.CHAR(10),
        allowNull: false,
        unique: true
    },
    Email: {
        type: DataTypes.STRING(30),
        unique:true 
    },
    Aadhar_no:{
        type: DataTypes.CHAR(12),
        allowNull: false,
        unique: true
    }
},{
    freezeTableName: true,
    createdAt: false,
    updatedAt: false
}) 

module.exports = GP_Customer;