const express = require("express");

const cidadeController = require("../controllers/cidadeController");
const autenticar = require("../middlewares/authMiddleware");
const somenteAdmin = require("../middlewares/adminMiddleware");

const router = express.Router();

router.get("/", cidadeController.listar);

router.post(
    "/",
    autenticar,
    somenteAdmin,
    cidadeController.criar
);

module.exports = router;