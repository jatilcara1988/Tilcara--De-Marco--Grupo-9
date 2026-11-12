const db = require("../database/db.js")
const { DataTypes } = require("sequelize")

const sales = db.define("sales", {
    id:{
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    clientName: {type: DataTypes.STRING,allowNull: false},
    total: {type: DataTypes.DECIMAL(10,2),allowNull: false},
    sellDate: {type: DataTypes.DATE,allowNull: false},
    saleMethod:{type: DataTypes.STRING(50), allowNull: false},
    createdAt: {type: DataTypes.DATE,allowNull: false},
    updatedAt: {type: DataTypes.DATE,allowNull: false}
});

module.exports = sales;