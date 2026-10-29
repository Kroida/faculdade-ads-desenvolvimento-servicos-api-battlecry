const pedidoService = require("../services/pedidoService");

async function criar(req, res, next) {
    try {
        const dadosPedido = {
            ...req.body,
            cliente_id: req.usuario.id
        };

        const pedido = await pedidoService.criarPedido(dadosPedido);

        return res.status(201).json(pedido);
    } catch (error) {
        next(error);
    }
}

async function listarMeus(req, res, next) {
    try {
        const clienteId = req.usuario.id;

        const pedidos = await pedidoService.listarPedidosCliente(clienteId);

        return res.status(200).json(pedidos);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    criar,
    listarMeus
};
