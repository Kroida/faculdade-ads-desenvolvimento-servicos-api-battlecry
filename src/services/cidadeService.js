const cidadeRepository = require("../repositories/cidadeRepository");

const BadRequestError = require("../errors/BadRequestError");

async function criarCidade(dados) {
    if (!dados.nome || typeof dados.nome !== "string") {
        throw new BadRequestError(
            "Nome da cidade é obrigatório"
        );
    }

    return cidadeRepository.criar({
        nome: dados.nome
    });
}

async function listarCidades() {
    return cidadeRepository.listar();
}

module.exports = {
    criarCidade,
    listarCidades
};