const express = require("express");

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../docs/swagger.json");

const cidadeRoutes = require("./routes/cidadeRoutes");
const clienteRoutes = require("./routes/clienteRoutes");
const categoriaRoutes = require("./routes/categoriaRoutes");
const produtoRoutes = require("./routes/produtoRoutes");
const pedidoRoutes = require("./routes/pedidoRoutes");
const authRoutes = require("./routes/authRoutes");

const NotFoundError = require("./errors/NotFoundError");
const errorMiddleware = require("./middlewares/errorMiddleware");

const app = express();

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/cidades", cidadeRoutes);
app.use("/clientes", clienteRoutes);
app.use("/categorias", categoriaRoutes);
app.use("/produtos", produtoRoutes);
app.use("/pedidos", pedidoRoutes);
app.use("/auth", authRoutes);

app.use((req, res, next) => {
    next(new NotFoundError("Rota não encontrada"));
});

app.use(errorMiddleware);

module.exports = app;
