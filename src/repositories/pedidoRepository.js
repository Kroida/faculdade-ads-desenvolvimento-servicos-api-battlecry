const prisma = require("../database/prisma");
const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");

const itensDoPedido = {
    pedidos_produtos: {
        include: {
            produtos: true
        }
    }
};

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
                where: { id: item.produto_id }
            });

            if (!produto) {
                throw new NotFoundError(
                    `Produto ${item.produto_id} não encontrado`
                );
            }

            // A condição gte + decrement acontece dentro da transação e evita
            // que o estoque fique negativo em uma compra concorrente.
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
        include: itensDoPedido,
        orderBy: {
            horario: "desc"
        }
    });
}

// Endpoint administrativo: consulta todos os pedidos sem expor a senha do cliente.
async function listarTodos() {
    return prisma.pedidos.findMany({
        include: {
            clientes: {
                select: {
                    id: true,
                    nome: true,
                    email: true
                }
            },
            ...itensDoPedido
        },
        orderBy: {
            horario: "desc"
        }
    });
}

module.exports = {
    criar,
    listarPorCliente,
    listarTodos
};
