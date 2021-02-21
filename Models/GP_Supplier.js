const { DataTypes} = require('sequelize');
const { sequelize } = require('.');

const GP_Supplier = sequelize.define('GP_Supplier,',{
    Reg_no: {
        type: DataTypes.CHAR(12),
        primaryKey: true,
    },
    First_Name: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    Middle_Name: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    Last_Name: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    Address: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    Mob_no: {
        type: DataTypes.CHAR(10),
        allowNull: false,
        unique: true 
    },
    Email: {
        type: DataTypes.STRING(30),
        unique: true
    },
    Aadhar_no: {
        type: DataTypes.CHAR(12),
        allowNull: false,
        unique: true
    },
    Pan_no: {
        type: DataTypes.CHAR(10),
        allowNull: false,
        unique: true    
    }
},
{
    freezeTableName = false,
    createdAt = false,
    updatedAt = false
});

module.exports = GP_Supplier;