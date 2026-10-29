const {PrismaClient} = require("@prisma/client");

const prisma = new PrismaClient();

async function criar(cliente) {
    return prisma.clientes.create({
        data: cliente
    });
}

async function listar() {
    return prisma.clientes.findMany({
        include: {
            cidades: true
        }
    });
}

async function buscarPorId(id) {
    return prisma.clientes.findUnique({
        where: {
            id: id
        },
        include: {
            cidades: true
        }
    });
}

async function buscarCidadePorId(id) {
    return prisma.cidades.findUnique({
        where: {
            id: id
        }
    });
}

async function buscarPorEmail(email) {
    return prisma.clientes.findUnique({
        where: {
            email: email
        }
    });
}

module.exports = {
    criar,
    listar,
    buscarPorId,
    buscarCidadePorId,
    buscarPorEmail
};