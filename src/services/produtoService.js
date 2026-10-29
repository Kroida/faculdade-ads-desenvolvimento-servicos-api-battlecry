const produtoRepository = require("../repositories/produtoRepository");

const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");

async function criarProduto(dados) {
    if (!dados.nome) {
        throw new BadRequestError("Nome é obrigatório");
    }

    if (typeof dados.preco !== "number") {
        throw new BadRequestError("Preço deve ser numérico");
    }

    if (typeof dados.quantidade !== "number") {
        throw new BadRequestError("Quantidade deve ser numérica");
    }

    if (!Number.isInteger(dados.categorias_id)) {
        throw new BadRequestError("categorias_id deve ser um número inteiro");
    }

    const categoria = await produtoRepository.buscarCategoriaPorId(dados.categorias_id);

    if (!categoria) {
        throw new NotFoundError("Categoria não encontrada");
    }

    return produtoRepository.criar(dados);
}

async function listarProdutos() {
    return produtoRepository.listar();
}

async function buscarProduto(id) {
    const produto = produtoRepository.buscarPorId(id);

    if (!produto) {
        throw new NotFoundError("Produto não encontrado");
    }

    return produto;
}

async function atualizarProduto(id, dados) {
    await buscarProduto(id);

    return produtoRepository.atualizar(id, dados);
}

async function deletarProduto(id) {
    await buscarProduto(id);

    return produtoRepository.deletar(id);
}

module.exports = {
    criarProduto,
    listarProdutos,
    buscarProduto,
    atualizarProduto,
    deletarProduto
}