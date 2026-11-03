const prisma = require("../database/prisma");

async function criar(categoria) {
    return prisma.categorias.create({
        data: categoria
    });
}

async function listar() {
    return prisma.categorias.findMany();
}

async function buscarPorId(id) {
    return prisma.categorias.findUnique({
        where: { id }
    });
}

async function atualizar(id, categoria) {
    return prisma.categorias.update({
        where: { id },
        data: categoria
    });
}

async function contarProdutos(id) {
    return prisma.produtos.count({
        where: { categorias_id: id }
    });
}

async function deletar(id) {
    return prisma.categorias.delete({
        where: { id }
    });
}

module.exports = {
    criar,
    listar,
    buscarPorId,
    atualizar,
    contarProdutos,
    deletar
};
