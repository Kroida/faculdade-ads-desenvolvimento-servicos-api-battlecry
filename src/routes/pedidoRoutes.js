const express = require("express");

const pedidoController = require("../controllers/pedidoController");
const autenticar = require("../middlewares/authMiddleware");
const somenteAdmin = require("../middlewares/adminMiddleware");

const router = express.Router();

// Cliente autenticado cria um pedido para si mesmo.
router.post("/", autenticar, pedidoController.criar);

// Administrador consulta todos os pedidos.
router.get("/", autenticar, somenteAdmin, pedidoController.listarTodos);

// Cliente autenticado consulta apenas os próprios pedidos.
router.get("/meus", autenticar, pedidoController.listarMeus);

module.exports = router;
