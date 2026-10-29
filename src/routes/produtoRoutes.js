const express = require("express");

const produtoController = require("../controllers/produtoController");
const autenticar = require("../middlewares/authMiddleware");
const somenteAdmin = require("../middlewares/adminMiddleware");

const router = express.Router();

router.post("/", autenticar, somenteAdmin, produtoController.criar);

router.get("/", produtoController.listar);

router.get("/:id", produtoController.buscarPorId);

router.put("/:id", autenticar, somenteAdmin, produtoController.atualizar);

router.delete("/:id", autenticar, somenteAdmin, produtoController.deletar);

module.exports = router;