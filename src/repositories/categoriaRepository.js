const prisma = require("../database/prisma");

async function criar(categoria) {
    return prisma.categorias.create({
        data: categoria
    });
}

async function listar() {
    return prisma.categorias.findMany();
}

module.exports = {
    criar,
    listar
};