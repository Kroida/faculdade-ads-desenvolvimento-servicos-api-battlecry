const pedidoRepository = require("../repositories/pedidoRepository");
const clienteRepository = require("../repositories/clienteRepository");

const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");

function validarProdutos(produtos) {
    if (!Array.isArray(produtos) || produtos.length === 0) {
        throw new BadRequestError("O pedido deve possuir pelo menos um produto");
    }

    const produtosNoPedido = new Set();

    for (const item of produtos) {
        if (!Number.isInteger(item.produto_id) || item.produto_id <= 0) {
            throw new BadRequestError("produto_id inválido");
        }

        if (typeof item.quantidade !== "number" || !Number.isFinite(item.quantidade) || item.quantidade <= 0) {
            throw new BadRequestError("Quantidade deve ser maior que zero");
        }

        if (produtosNoPedido.has(item.produto_id)) {
            throw new BadRequestError(
                `Produto ${item.produto_id} foi informado mais de uma vez`
            );
        }

        produtosNoPedido.add(item.produto_id);
    }
}

async function validarCliente(clienteId) {
    if (!Number.isInteger(clienteId) || clienteId <= 0) {
        throw new BadRequestError("cliente_id inválido");
    }

    const cliente = await clienteRepository.buscarPorId(clienteId);

    if (!cliente) {
        throw new NotFoundError("Cliente não encontrado");
    }
}

async function criarPedido(dados) {
    if (!dados.endereco || typeof dados.endereco !== "string" || !dados.endereco.trim()) {
        throw new BadRequestError("Endereço é obrigatório");
    }

    await validarCliente(dados.cliente_id);
    validarProdutos(dados.produtos);

    return pedidoRepository.criar({
        ...dados,
        endereco: dados.endereco.trim()
    });
}

async function listarPedidosCliente(clienteId) {
    await validarCliente(clienteId);
    return pedidoRepository.listarPorCliente(clienteId);
}

async function listarTodosPedidos() {
    return pedidoRepository.listarTodos();
}

async function buscarPedido(id) {
    const pedido = await pedidoRepository.buscarPorId(id);

    if (!pedido) {
        throw new NotFoundError("Pedido não encontrado");
    }

    return pedido;
}

async function atualizarPedido(id, dados) {
    await buscarPedido(id);

    const atualizacao = {};

    if (dados.endereco !== undefined) {
        if (typeof dados.endereco !== "string" || !dados.endereco.trim()) {
            throw new BadRequestError("Endereço deve ser uma string não vazia");
        }

        atualizacao.endereco = dados.endereco.trim();
    }

    if (dados.cliente_id !== undefined) {
        await validarCliente(dados.cliente_id);
        atualizacao.cliente_id = dados.cliente_id;
    }

    if (dados.produtos !== undefined) {
        validarProdutos(dados.produtos);
        atualizacao.produtos = dados.produtos;
    }

    if (Object.keys(atualizacao).length === 0) {
        throw new BadRequestError("Informe pelo menos um campo para atualizar");
    }

    return pedidoRepository.atualizar(id, atualizacao);
}

async function deletarPedido(id) {
    await buscarPedido(id);
    return pedidoRepository.deletar(id);
}

module.exports = {
    criarPedido,
    listarPedidosCliente,
    listarTodosPedidos,
    buscarPedido,
    atualizarPedido,
    deletarPedido
};
