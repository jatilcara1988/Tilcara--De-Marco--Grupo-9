const products = require("../models/products.models");

const adminController = {
    showDashboard: async (req, res) => {
        try {
            const lstProducts = await products.findAll({
                raw: true
            });
            res.render("dashboard", {
                productos: lstProducts
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("Error al cargar el dashboard");
        }
    }
};

module.exports = adminController;
