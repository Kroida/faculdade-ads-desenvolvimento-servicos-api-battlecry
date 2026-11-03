const prisma = require("../database/prisma");

async function criar(cidade) {
    return prisma.cidades.create({
        data: cidade
    });
}

async function listar() {
    return prisma.cidades.findMany();
}

module.exports = {
    criar,
    listar
};