const pedidoService = require("../services/pedidoService");

async function criar(req, res, next) {
    try {
        const pedido = await pedidoService.criarPedido(req.body);

        return res.status(201).json(pedido);
    } catch (error) {
        next(error);
    }
}

async function listarPorCliente(req, res, next) {
    try {
        const clienteId = Number(req.params.clienteId);

        const pedidos = await pedidoService.listarPedidosCliente(clienteId);

        return res.status(200).json(pedidos);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    criar,
    listarPorCliente
};