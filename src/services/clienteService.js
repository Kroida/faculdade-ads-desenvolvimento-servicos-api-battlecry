const clienteRepository = require("../repositories/clienteRepository");

const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");

async function criarCliente(dados) {
    if (!dados.nome) {
        throw new BadRequestError("Nome é obrigatório");
    }

    if (typeof dados.nome !== "string") {
        throw new BadRequestError("Nome deve ser uma string");
    }

    if (!Number.isInteger(dados.cidade_id)) {
        throw new BadRequestError("cidade_id deve ser um número inteiro");
    }

    if (dados.altura !== undefined && typeof dados.altura !== "number") {
        throw new BadRequestError("Altura deve ser numérica");
    }

    const cidade = await clienteRepository.buscarCidadePorId(dados.cidade_id);

    if(!cidade) {
        throw new NotFoundError("Cidade não encontrada");
    }

    return clienteRepository.criar(dados);
}

async function listarClientes() {
    return clienteRepository.listar();
}

async function buscarCliente(id) {
    const cliente = await clienteRepository.buscarPorId(id);

    if(!cliente) {
        throw new NotFoundError("Cliente não encontrado");
    }

    return cliente;
}

module.exports = {
    criarCliente,
    listarClientes,
    buscarCliente
}