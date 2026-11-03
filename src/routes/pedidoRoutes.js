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

// Gerenciamento administrativo de pedidos.
router.put("/:id", autenticar, somenteAdmin, pedidoController.atualizar);
router.delete("/:id", autenticar, somenteAdmin, pedidoController.deletar);

module.exports = router;
