const db = require("../database/db.js")
const { DataTypes } = require("sequelize")

const users = db.define("users", {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    userName: {type: DataTypes.STRING(200),allowNull: false},
    email: {type: DataTypes.STRING(200),allowNull: false, unique: true},
    passwordLocal: {type: DataTypes.STRING(200),allowNull: false},
    phone: {type: DataTypes.STRING(200),allowNull: true},
    jobTitle: {type: DataTypes.STRING,allowNull: false},
    isActive: {type: DataTypes.BOOLEAN,allowNull: false, defaultValue: true},
    createdAt: {type: DataTypes.DATE,allowNull: false},
    updatedAt: {type: DataTypes.DATE,allowNull: false}
});

module.exports = users;