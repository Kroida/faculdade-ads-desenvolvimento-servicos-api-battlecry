const express = require("express");

const clienteController = require("../controllers/clienteController");

const router = express.Router();

router.post("/", clienteController.criar);

router.get("/", clienteController.listar);

router.get("/:id", clienteController.buscarPorId);

module.exports = router;