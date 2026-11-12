const db = require("../database/db.js")
const { DataTypes } = require("sequelize")

const categories = db.define("categories", {
    id: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
    categoryType:{type: DataTypes.STRING,allowNull: false},
    createdAt: {type: DataTypes.DATE,allowNull: false},
    updatedAt: {type: DataTypes.DATE,allowNull: false}
});

module.exports = categories