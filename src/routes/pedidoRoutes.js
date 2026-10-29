const express = require("express");

const pedidoController = require("../controllers/pedidoController");

const router = express.Router();

router.post("/", pedidoController.criar);

router.get("/cliente/:clienteId", pedidoController.listarPorCliente);

module.exports = router;