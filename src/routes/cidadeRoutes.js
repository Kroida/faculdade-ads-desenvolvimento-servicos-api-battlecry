const express = require("express");

const cidadeController = require("../controllers/cidadeController");
const autenticar = require("../middlewares/authMiddleware");
const somenteAdmin = require("../middlewares/adminMiddleware");

const router = express.Router();

router.get("/", cidadeController.listar);

router.post("/", autenticar, somenteAdmin, cidadeController.criar);
router.put("/:id", autenticar, somenteAdmin, cidadeController.atualizar);
router.delete("/:id", autenticar, somenteAdmin, cidadeController.deletar);

module.exports = router;
