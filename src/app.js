const express = require("express");

const clienteRoutes = require("./routes/clienteRoutes");
const errorMiddleware = require("./middlewares/errorMiddleware");

const app = express();

app.use(express.json());

app.use("/clientes", clienteRoutes);

app.use(errorMiddleware);

module.exports = app;