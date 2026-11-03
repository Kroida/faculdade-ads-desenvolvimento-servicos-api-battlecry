const express = require("express");
const path = require("path");
const swaggerUi = require("swagger-ui-express");

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

// Expõe sempre o arquivo swagger.json atual e impede cache do navegador.
app.get("/api-docs.json", (req, res) => {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    return res.sendFile(path.join(__dirname, "../docs/swagger.json"));
});

// O Swagger UI busca a especificação diretamente da rota acima.
// Assim, alterações em docs/swagger.json não ficam presas em require cache.
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(null, {
        swaggerOptions: {
            url: "/api-docs.json"
        }
    })
);

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
