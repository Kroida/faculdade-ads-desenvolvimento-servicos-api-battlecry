const express = require("express");

const pedidoController = require("../controllers/pedidoController");
const autenticar = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", autenticar, pedidoController.criar);

router.get("/meus", autenticar, pedidoController.listarMeus);

module.exports = router;
