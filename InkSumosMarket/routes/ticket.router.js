const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/ticket.controllers.js");

router.post("/checkout", ticketController.checkoutTicket);
router.get("/pdf", ticketController.downloadTicket);
router.get("/data", ticketController.getTicketData);
router.get("/", ticketController.generateTicket);

module.exports = router;

