const {PrismaClient} = require("@prisma/client");

const prisma = new PrismaClient();

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
        where: {
            id: id
        },
        include: {
            categorias: true
        }
    });
}

async function atualizar(id, produto) {
    return prisma.produtos.findUnique({
        where: {
            id: id
        },
        data: produto
    });
}

async function deletar(id) {
    return prisma.produtos.findUnique({
        where: {
            id: id
        }
    });
}

async function buscarCategoriaPorId(id) {
    return prisma.categorias.findUnique({
        where: {
            id: id
        }
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