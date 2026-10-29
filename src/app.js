const express = require("express");

const clienteRoutes = require("./routes/clienteRoutes");
const produtoRoutes = require("./routes/produtoRoutes");
const pedidoRoutes = require("./routes/pedidoRoutes");
const authRoutes = require("./routes/authRoutes");

const errorMiddleware = require("./middlewares/errorMiddleware");

const app = express();

app.use(express.json());

app.use("/clientes", clienteRoutes);
app.use("/produtos", produtoRoutes)
app.use("/pedidos", pedidoRoutes);
app.use("/auth", authRoutes);

app.use(errorMiddleware);

module.exports = app;