const categoriaRepository = require("../repositories/categoriaRepository");

const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");

function validarNome(nome) {
    if (!nome || typeof nome !== "string" || !nome.trim()) {
        throw new BadRequestError("Nome da categoria é obrigatório");
    }

    return nome.trim();
}

async function criarCategoria(dados) {
    const nome = validarNome(dados.nome);

    return categoriaRepository.criar({ nome });
}

async function listarCategorias() {
    return categoriaRepository.listar();
}

async function buscarCategoria(id) {
    const categoria = await categoriaRepository.buscarPorId(id);

    if (!categoria) {
        throw new NotFoundError("Categoria não encontrada");
    }

    return categoria;
}

async function atualizarCategoria(id, dados) {
    await buscarCategoria(id);
    const nome = validarNome(dados.nome);

    return categoriaRepository.atualizar(id, { nome });
}

async function deletarCategoria(id) {
    await buscarCategoria(id);

    const produtosVinculados = await categoriaRepository.contarProdutos(id);

    if (produtosVinculados > 0) {
        throw new BadRequestError(
            "Categoria possui produtos vinculados. Atualize ou exclua esses produtos antes de remover a categoria"
        );
    }

    return categoriaRepository.deletar(id);
}

module.exports = {
    criarCategoria,
    listarCategorias,
    buscarCategoria,
    atualizarCategoria,
    deletarCategoria
};
