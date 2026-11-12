const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");

async function resetDatabase() {
    try {
        const conexion = await mysql.createConnection({
            host: process.env.DB_HOST || "127.0.0.1",
            user: process.env.DB_USER || "root",
            password: process.env.DB_PASSWORD || "",
            multipleStatements: true
        });
        const sql = fs.readFileSync(
            path.join(__dirname, "database.sql"),
            "utf8"
        );
        await conexion.query(sql);
        console.log("Base de datos recreada correctamente");
        await conexion.end();
    } catch (error) {
        console.error("Error al recrear la base de datos:");
        console.error(error);
    }
}

resetDatabase();