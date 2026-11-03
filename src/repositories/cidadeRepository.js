const prisma = require("../database/prisma");

async function criar(cidade) {
    return prisma.cidades.create({
        data: cidade
    });
}

async function listar() {
    return prisma.cidades.findMany();
}

async function buscarPorId(id) {
    return prisma.cidades.findUnique({
        where: { id }
    });
}

async function atualizar(id, cidade) {
    return prisma.cidades.update({
        where: { id },
        data: cidade
    });
}

async function deletar(id) {
    return prisma.cidades.delete({
        where: { id }
    });
}

module.exports = {
    criar,
    listar,
    buscarPorId,
    atualizar,
    deletar
};
