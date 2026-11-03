const categoriaRepository = require("../repositories/categoriaRepository");

const BadRequestError = require("../errors/BadRequestError");

async function criarCategoria(dados) {
    if (!dados.nome || typeof dados.nome !== "string") {
        throw new BadRequestError(
            "Nome da categoria é obrigatório"
        );
    }

    return categoriaRepository.criar({
        nome: dados.nome
    });
}

async function listarCategorias() {
    return categoriaRepository.listar();
}

module.exports = {
    criarCategoria,
    listarCategorias
};