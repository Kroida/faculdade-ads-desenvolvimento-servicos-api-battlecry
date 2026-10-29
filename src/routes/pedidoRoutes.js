const express = require("express");

const pedidoController = require("../controllers/pedidoController");
const autenticar = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", autenticar, pedidoController.criar);

router.get("/cliente/:clienteId", pedidoController.listarPorCliente);

module.exports = router;