const express = require("express");

const clienteController = require("../controllers/clienteController");
const autenticar = require("../middlewares/authMiddleware");
const somenteAdmin = require("../middlewares/adminMiddleware");

const router = express.Router();

// Cadastro público de cliente.
router.post("/", clienteController.criar);

// Gerenciamento de clientes: somente administradores.
router.get("/", autenticar, somenteAdmin, clienteController.listar);
router.get("/:id", autenticar, somenteAdmin, clienteController.buscarPorId);
router.put("/:id", autenticar, somenteAdmin, clienteController.atualizar);
router.delete("/:id", autenticar, somenteAdmin, clienteController.deletar);

module.exports = router;
