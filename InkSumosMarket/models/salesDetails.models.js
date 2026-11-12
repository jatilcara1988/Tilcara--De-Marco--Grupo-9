/* importar la base de datos */
const db = require("../database/db.js")
const { DataTypes } = require("sequelize")

const salesDetails = db.define("sales_details", {
    id:{
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    saleId: {type: DataTypes.BIGINT.UNSIGNED, allowNull: false},
    productId: {type: DataTypes.BIGINT.UNSIGNED, allowNull: false},
    quantity: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 1},
    createdAt: {type: DataTypes.DATE, allowNull: false},
    updatedAt: {type: DataTypes.DATE, allowNull: false}
});

module.exports = salesDetails;