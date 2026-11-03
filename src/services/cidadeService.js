const cidadeRepository = require("../repositories/cidadeRepository");

const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");

function validarNome(nome) {
    if (!nome || typeof nome !== "string" || !nome.trim()) {
        throw new BadRequestError("Nome da cidade é obrigatório");
    }

    return nome.trim();
}

async function criarCidade(dados) {
    const nome = validarNome(dados.nome);
    return cidadeRepository.criar({ nome });
}

async function listarCidades() {
    return cidadeRepository.listar();
}

async function buscarCidade(id) {
    const cidade = await cidadeRepository.buscarPorId(id);

    if (!cidade) {
        throw new NotFoundError("Cidade não encontrada");
    }

    return cidade;
}

async function atualizarCidade(id, dados) {
    await buscarCidade(id);
    const nome = validarNome(dados.nome);

    return cidadeRepository.atualizar(id, { nome });
}

async function deletarCidade(id) {
    await buscarCidade(id);

    // O banco usa ON DELETE SET NULL na relação clientes -> cidades.
    return cidadeRepository.deletar(id);
}

module.exports = {
    criarCidade,
    listarCidades,
    buscarCidade,
    atualizarCidade,
    deletarCidade
};
