const pedidoRepository = require("../repositories/pedidoRepository");
const clienteRepository = require("../repositories/clienteRepository");

const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");

async function criarPedido(dados) {
    if (!dados.endereco || typeof dados.endereco !== "string") {
        throw new BadRequestError("Endereço é obrigatório");
    }

    if (!Number.isInteger(dados.cliente_id)) {
        throw new BadRequestError("cliente_id inválido");
    }

    if (!Array.isArray(dados.produtos) || dados.produtos.length === 0) {
        throw new BadRequestError("O pedido deve possuir pelo menos um produto");
    }

    const cliente = await clienteRepository.buscarPorId(dados.cliente_id);

    if (!cliente) {
        throw new NotFoundError("Cliente não encontrado");
    }

    const produtosNoPedido = new Set();

    for (const item of dados.produtos) {
        if (!Number.isInteger(item.produto_id) || item.produto_id <= 0) {
            throw new BadRequestError("produto_id inválido");
        }

        if (typeof item.quantidade !== "number" || item.quantidade <= 0) {
            throw new BadRequestError("Quantidade deve ser maior que zero");
        }

        if (produtosNoPedido.has(item.produto_id)) {
            throw new BadRequestError(
                `Produto ${item.produto_id} foi informado mais de uma vez`
            );
        }

        produtosNoPedido.add(item.produto_id);
    }

    return pedidoRepository.criar(dados);
}

async function listarPedidosCliente(clienteId) {
    if (!Number.isInteger(clienteId) || clienteId <= 0) {
        throw new BadRequestError("ID do cliente inválido");
    }

    const cliente = await clienteRepository.buscarPorId(clienteId);

    if (!cliente) {
        throw new NotFoundError("Cliente não encontrado");
    }

    return pedidoRepository.listarPorCliente(clienteId);
}

async function listarTodosPedidos() {
    return pedidoRepository.listarTodos();
}

module.exports = {
    criarPedido,
    listarPedidosCliente,
    listarTodosPedidos
};
