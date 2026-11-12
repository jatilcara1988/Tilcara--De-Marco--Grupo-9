const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller.js");

const validateRegister = require("../middlewares/validateRegister.js");


router.get("/login", authController.showLogin);

router.post("/login", authController.login);

router.post("/registrar", validateRegister, authController.initRegister);

router.get("/logout", authController.logout);

module.exports = router;