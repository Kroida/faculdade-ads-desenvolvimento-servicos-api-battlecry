const express = require("express");

const categoriaController = require("../controllers/categoriaController");
const autenticar = require("../middlewares/authMiddleware");
const somenteAdmin = require("../middlewares/adminMiddleware");

const router = express.Router();

router.get("/", categoriaController.listar);

router.post("/", autenticar, somenteAdmin, categoriaController.criar);
router.put("/:id", autenticar, somenteAdmin, categoriaController.atualizar);
router.delete("/:id", autenticar, somenteAdmin, categoriaController.deletar);

module.exports = router;
