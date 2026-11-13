const db = require("../database/db.js")
const { DataTypes } = require("sequelize")

const products = db.define("products",{
    id:{
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    productName: {type: DataTypes.STRING(100), allowNull: false},
    productDescription: {type: DataTypes.TEXT, allowNull: false},
    productImage: {type: DataTypes.STRING, allowNull: false},
    price: {type: DataTypes.FLOAT, allowNull: false},
    stock: {type: DataTypes.INTEGER, allowNull: false},
    isActive: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true},
    categoryId: {type: DataTypes.BIGINT.UNSIGNED, allowNull: false},
    createdAt: {type: DataTypes.DATE, allowNull: false},
    updatedAt: {type: DataTypes.DATE,allowNull: true}
});

module.exports = products;