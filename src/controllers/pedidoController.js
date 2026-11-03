const pedidoService = require("../services/pedidoService");
const { validarId } = require("../utils/validationUtils");

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
        const pedidos = await pedidoService.listarPedidosCliente(req.usuario.id);
        return res.status(200).json(pedidos);
    } catch (error) {
        next(error);
    }
}

async function listarTodos(req, res, next) {
    try {
        const pedidos = await pedidoService.listarTodosPedidos();
        return res.status(200).json(pedidos);
    } catch (error) {
        next(error);
    }
}

async function atualizar(req, res, next) {
    try {
        const id = validarId(req.params.id);
        const pedido = await pedidoService.atualizarPedido(id, req.body);
        return res.status(200).json(pedido);
    } catch (error) {
        next(error);
    }
}

async function deletar(req, res, next) {
    try {
        const id = validarId(req.params.id);
        await pedidoService.deletarPedido(id);
        return res.status(204).send();
    } catch (error) {
        next(error);
    }
}

module.exports = {
    criar,
    listarMeus,
    listarTodos,
    atualizar,
    deletar
};
