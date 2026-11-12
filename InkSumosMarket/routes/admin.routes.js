const express = require("express");
const router = express.Router();

// Controllers
const adminController = require("../controllers/admin.controllers.js");
const salesController = require("../controllers/sales.controllers.js");
const productController = require("../controllers/product.controllers.js");

// Middlewares
const verifyJWT = require("../middlewares/verifyJWT.js");
const validateProduct = require("../middlewares/validateProduct.js");
const uploadProductImage = require("../middlewares/uploadProductImage.js");

// Routes
router.use(verifyJWT);
router.get("/dashboard", adminController.showDashboard);
router.get("/ventas", salesController.findAllSales);
router.get("/productos/crear", productController.formCreateProduct);
router.get("/productos/editar/:id", productController.formUpdateProduct);
router.post("/productos/editar/:id", uploadProductImage, validateProduct, productController.updateProduct);
router.post("/productos/eliminar/:id", productController.deleteProduct);
router.post("/productos/reactivar/:id", productController.reactivateProduct);
router.post("/productos/crear", uploadProductImage, validateProduct, productController.createProduct);

module.exports = router;