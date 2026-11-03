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

async function atualizarCliente(id, dados, administradorId) {
    const clienteAtual = await buscarCliente(id);
    const atualizacao = {};

    if (dados.nome !== undefined) {
        if (typeof dados.nome !== "string" || !dados.nome.trim()) {
            throw new BadRequestError("Nome deve ser uma string não vazia");
        }

        atualizacao.nome = dados.nome.trim();
    }

    if (dados.altura !== undefined) {
        if (dados.altura !== null && (typeof dados.altura !== "number" || !Number.isFinite(dados.altura))) {
            throw new BadRequestError("Altura deve ser numérica ou null");
        }

        atualizacao.altura = dados.altura;
    }

    if (dados.nascimento !== undefined) {
        if (dados.nascimento === null) {
            atualizacao.nascimento = null;
        } else {
            const nascimento = new Date(dados.nascimento);

            if (Number.isNaN(nascimento.getTime())) {
                throw new BadRequestError("Nascimento deve ser uma data válida");
            }

            atualizacao.nascimento = nascimento;
        }
    }

    if (dados.cidade_id !== undefined) {
        if (dados.cidade_id === null) {
            atualizacao.cidade_id = null;
        } else {
            if (!Number.isInteger(dados.cidade_id) || dados.cidade_id <= 0) {
                throw new BadRequestError("cidade_id deve ser um número inteiro positivo ou null");
            }

            const cidade = await clienteRepository.buscarCidadePorId(dados.cidade_id);

            if (!cidade) {
                throw new NotFoundError("Cidade não encontrada");
            }

            atualizacao.cidade_id = dados.cidade_id;
        }
    }

    if (dados.email !== undefined) {
        if (typeof dados.email !== "string" || !dados.email.trim()) {
            throw new BadRequestError("Email deve ser uma string não vazia");
        }

        const email = dados.email.trim();
        const usuarioExistente = await clienteRepository.buscarPorEmail(email);

        if (usuarioExistente && usuarioExistente.id !== id) {
            throw new BadRequestError("Email já cadastrado");
        }

        atualizacao.email = email;
    }

    if (dados.senha !== undefined) {
        if (typeof dados.senha !== "string" || dados.senha.length < 6) {
            throw new BadRequestError("Senha deve possuir pelo menos 6 caracteres");
        }

        atualizacao.senha = await bcrypt.hash(dados.senha, 10);
    }

    if (dados.tipo !== undefined) {
        if (!['CLIENTE', 'ADMIN'].includes(dados.tipo)) {
            throw new BadRequestError("Tipo deve ser CLIENTE ou ADMIN");
        }

        if (id === administradorId && dados.tipo !== "ADMIN") {
            throw new BadRequestError("Administrador não pode remover o próprio privilégio");
        }

        atualizacao.tipo = dados.tipo;
    }

    if (Object.keys(atualizacao).length === 0) {
        throw new BadRequestError("Informe pelo menos um campo para atualizar");
    }

    // Mantém a leitura explícita para deixar claro que a conta existe antes do update.
    void clienteAtual;

    return clienteRepository.atualizar(id, atualizacao);
}

async function deletarCliente(id, administradorId) {
    await buscarCliente(id);

    if (id === administradorId) {
        throw new BadRequestError("Administrador não pode excluir a própria conta");
    }

    return clienteRepository.deletarComPedidos(id);
}

module.exports = {
    criarCliente,
    listarClientes,
    buscarCliente,
    atualizarCliente,
    deletarCliente
};
