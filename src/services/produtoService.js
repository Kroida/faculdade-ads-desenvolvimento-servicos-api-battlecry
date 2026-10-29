const produtoRepository = require("../repositories/produtoRepository");

const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");

async function validarProduto(dados) {
    if (!dados.nome || typeof dados.nome !== "string" || !dados.nome.trim()) {
        throw new BadRequestError("Nome é obrigatório");
    }

    if (typeof dados.preco !== "number" || !Number.isFinite(dados.preco) || dados.preco < 0) {
        throw new BadRequestError("Preço deve ser um número maior ou igual a zero");
    }

    if (typeof dados.quantidade !== "number" || !Number.isFinite(dados.quantidade) || dados.quantidade < 0) {
        throw new BadRequestError("Quantidade deve ser um número maior ou igual a zero");
    }

    if (!Number.isInteger(dados.categorias_id) || dados.categorias_id <= 0) {
        throw new BadRequestError("categorias_id deve ser um número inteiro positivo");
    }

    const categoria = await produtoRepository.buscarCategoriaPorId(dados.categorias_id);

    if (!categoria) {
        throw new NotFoundError("Categoria não encontrada");
    }
}

async function criarProduto(dados) {
    await validarProduto(dados);

    return produtoRepository.criar(dados);
}

async function listarProdutos() {
    return produtoRepository.listar();
}

async function buscarProduto(id) {
    const produto = await produtoRepository.buscarPorId(id);

    if (!produto) {
        throw new NotFoundError("Produto não encontrado");
    }

    return produto;
}

async function atualizarProduto(id, dados) {
    await buscarProduto(id);
    await validarProduto(dados);

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
};
