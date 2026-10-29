const bcrypt = require("bcrypt");

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

    if (dados.altura !== undefined && typeof dados.altura !== "number") {
        throw new BadRequestError("Altura deve ser numérica");
    }

    if (!Number.isInteger(dados.cidade_id)) {
        throw new BadRequestError("cidade_id deve ser um número inteiro");
    }

    const cidade = await clienteRepository.buscarCidadePorId(dados.cidade_id);

    if (!cidade) {
        throw new NotFoundError("Cidade não encontrada");
    }

    if (!dados.email || typeof dados.email !== "string") {
        throw new BadRequestError("Email é obrigatório");
    }

    const usuarioExistente = await clienteRepository.buscarPorEmail(dados.email);

    if (usuarioExistente) {
        throw new BadRequestError("Email já cadastrado");
    }

    if (!dados.senha || typeof dados.senha !== "string") {
        throw new BadRequestError("Senha é obrigatória");
    }

    if (dados.senha.length < 6) {
        throw new BadRequestError("Senha deve possuir pelo menos 6 caracteres");
    }

    const senhaHash = await bcrypt.hash(dados.senha, 10);

    const cliente = {
        ...dados,
        senha: senhaHash,
        tipo: "CLIENTE"
    };

    return clienteRepository.criar(cliente);
}

async function listarClientes() {
    return clienteRepository.listar();
}

async function buscarCliente(id) {
    const cliente = await clienteRepository.buscarPorId(id);

    if (!cliente) {
        throw new NotFoundError("Cliente não encontrado");
    }

    return cliente;
}

module.exports = {
    criarCliente,
    listarClientes,
    buscarCliente
};
