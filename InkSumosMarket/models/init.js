const db = require("../database/db.js");

const users = require("./users.models.js");
const products = require("./products.models.js");
const categories = require("./categories.models.js");
const sales = require("./sales.models.js");
const salesDetails = require("./salesDetails.models.js");

/* ======================
   RELATIONS
====================== */

/* CATEGORIES -> PRODUCTS (1:N) */
categories.hasMany(products, {
    foreignKey: "categoryId"
});

products.belongsTo(categories, {
    foreignKey: "categoryId"
});

/* SALES -> SALE DETAILS (1:N) */
sales.hasMany(salesDetails, {
    foreignKey: "saleId",
    as: "salesDetails"
});

salesDetails.belongsTo(sales, {
    foreignKey: "saleId"
});

/* PRODUCTS -> SALE DETAILS (1:N) */
products.hasMany(salesDetails, {
    foreignKey: "productId"
});

salesDetails.belongsTo(products, {
    foreignKey: "productId",
    as: "product"
});

/* =========================
   SINCRONIZATION INTO DATABASE
========================= */
const syncDB = async () => {
    try {
        await db.authenticate();
        console.log("Conexión exitosa");
        await db.sync();
        console.log("Base de datos sincronizada");
    } catch (error) {
        console.log("Error al sincronizar:", error);
        throw error;
    }
};

module.exports = {
    syncDB,
    users,
    products,
    categories,
    sales,
    salesDetails
};