function errorMiddleware(error, req, res, next) {
    const status = error.statusCode || 500;

    const mensagem = status === 500
        ? "Erro interno do servidor"
        : error.message;

    return res.status(status).json({
        erro: mensagem
    });
}

module.exports = errorMiddleware;
