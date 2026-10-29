const prisma = require("../database/prisma");

const clientePublico = {
    id: true,
    nome: true,
    altura: true,
    nascimento: true,
    cidade_id: true,
    email: true,
    tipo: true,
    cidades: true
};

async function criar(cliente) {
    return prisma.clientes.create({
        data: cliente,
        select: clientePublico
    });
}

async function listar() {
    return prisma.clientes.findMany({
        select: clientePublico
    });
}

async function buscarPorId(id) {
    return prisma.clientes.findUnique({
        where: { id },
        select: clientePublico
    });
}

async function buscarCidadePorId(id) {
    return prisma.cidades.findUnique({
        where: { id }
    });
}

// Consulta interna para autenticação. Aqui a senha precisa ser recuperada
// para que o bcrypt consiga comparar o hash salvo com a senha informada.
async function buscarPorEmail(email) {
    return prisma.clientes.findUnique({
        where: { email }
    });
}

module.exports = {
    criar,
    listar,
    buscarPorId,
    buscarCidadePorId,
    buscarPorEmail
};
