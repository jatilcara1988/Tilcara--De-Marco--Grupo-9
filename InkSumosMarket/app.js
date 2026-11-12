// Inciando configuracion
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

// Database configuration
const sequelize = require('./database/db.js');
const { syncDB } = require('./models/init.js');

// Import routes
const productRoutes = require('./routes/products.routes.js');
const ticketRoutes = require('./routes/ticket.router.js');
const authRoutes = require("./routes/auth.routes.js");
const adminRoutes = require("./routes/admin.routes.js");

// App and configuration
const app = express();
const PORT = process.env.PORT || 3000;
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Globals Variables
let server = null
let shuttingDown = false

// Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/products", productRoutes);
app.use("/ticket", ticketRoutes);
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);

// Start the server and synchronize the database
const startServer = async () => {
    try {
        await syncDB();
        server = app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`)
        })
    } catch (error) {
        console.log("Error al iniciar el servidor:", error)
        process.exit(1)
    }
}

// Shutdown function to gracefully close the server and database connection
const shutdown = async (signal) => {
    if (shuttingDown) return
    shuttingDown = true
    console.log(`\nRecibido ${signal}. Cerrando aplicación...`)
    try {
        if (server && server.listening) {
            await new Promise((resolve, reject) => {
                server.close((error) => {
                    if (error && error.code !== "ERR_SERVER_NOT_RUNNING") {
                        return reject(error)
                    }
                    resolve()
                })
            })
            server = null
        }
        await sequelize.close() //Cierra todo y debe hacer una nueva llamada para crear una nueva instancia
        console.log("Aplicación detenida correctamente")
        process.exit(0)
    } catch (error) {
        console.log("Error durante el cierre:", error)
        process.exit(1)
    }
}

// Eventos del proceso
process.on("SIGINT", () => shutdown("SIGINT"))
process.on("SIGTERM", () => shutdown("SIGTERM"))

//Inicio
startServer();