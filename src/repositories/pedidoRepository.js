const {PrismaClient} = require("@prisma/client");
const BadRequestError = require("../errors/BadRequestError");

const prisma = new PrismaClient();

async function criar(dados) {
    return prisma.$transaction(async (tx) => {
        const pedido = await tx.pedidos.create({
            data: {
                horario: new Date(),
                endereco: dados.endereco,
                cliente_id: dados.cliente_id
            }
        });

        for (const item of dados.produtos) {
            const produto = await tx.produtos.findUnique({
                where: {
                    id: item.produto_id
                }
            });

            if (!produto) {
                throw new BadRequestError(
                    `Produto ${item.produto_id} não encontrado`
                );
            }
           
            const estoqueAtualizado = await tx.produtos.updateMany({
                where: {
                    id: item.produto_id,
                    quantidade: {
                        gte: item.quantidade
                    }
                },

                data: {
                    quantidade: {
                        decrement: item.quantidade
                    }
                }
            });

            if (estoqueAtualizado.count === 0) {
                throw new BadRequestError(
                    `Estoque insuficiente para ${produto.nome}`
                );
            }

            await tx.pedidos_produtos.create({
                data: {
                    pedido_id: pedido.id,
                    produto_id: produto.id,
                    preco: produto.preco,
                    quantidade: item.quantidade
                }
            });
        }

        return pedido;
    });
}

async function listarPorCliente(clienteId) {
    return prisma.pedidos.findMany({
        where: {
            cliente_id: clienteId
        },

        include: {
            pedidos_produtos: {
                include: {
                    produtos: true
                }
            }
        },

        orderBy: {
            horario: "desc"
        }
    });
}

module.exports = {
    criar,
    listarPorCliente
};