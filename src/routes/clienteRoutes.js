const express = require("express");

const clienteController = require("../controllers/clienteController");
const autenticar = require("../middlewares/authMiddleware");
const somenteAdmin = require("../middlewares/adminMiddleware");

const router = express.Router();

// Cadastro público de cliente.
router.post("/", clienteController.criar);

// Consultas administrativas; evitam exposição pública de dados pessoais.
router.get("/", autenticar, somenteAdmin, clienteController.listar);
router.get("/:id", autenticar, somenteAdmin, clienteController.buscarPorId);

module.exports = router;
