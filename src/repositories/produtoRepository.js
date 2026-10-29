const prisma = require("../database/prisma");

async function criar(produto) {
    return prisma.produtos.create({
        data: produto
    });
}

async function listar() {
    return prisma.produtos.findMany({
        include: {
            categorias: true
        }
    });
}

async function buscarPorId(id) {
    return prisma.produtos.findUnique({
        where: { id },
        include: {
            categorias: true
        }
    });
}

async function atualizar(id, produto) {
    return prisma.produtos.update({
        where: { id },
        data: produto
    });
}

async function deletar(id) {
    return prisma.produtos.delete({
        where: { id }
    });
}

async function buscarCategoriaPorId(id) {
    return prisma.categorias.findUnique({
        where: { id }
    });
}

module.exports = {
    criar,
    listar,
    buscarPorId,
    atualizar,
    deletar,
    buscarCategoriaPorId
};
