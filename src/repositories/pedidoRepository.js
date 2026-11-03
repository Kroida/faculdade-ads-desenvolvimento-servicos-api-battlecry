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

async function buscarPorId(id) {
    return prisma.pedidos.findUnique({
        where: { id },
        include: {
            clientes: {
                select: {
                    id: true,
                    nome: true,
                    email: true
                }
            },
            ...itensDoPedido
        }
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

async function atualizar(id, dados) {
    return prisma.$transaction(async (tx) => {
        const pedidoAtual = await tx.pedidos.findUnique({
            where: { id },
            include: {
                pedidos_produtos: true
            }
        });

        if (!pedidoAtual) {
            throw new NotFoundError("Pedido não encontrado");
        }

        // Quando os itens forem alterados, primeiro devolvemos o estoque do
        // pedido antigo e só depois reservamos o estoque dos novos itens.
        if (dados.produtos !== undefined) {
            for (const item of pedidoAtual.pedidos_produtos) {
                await tx.produtos.update({
                    where: { id: item.produto_id },
                    data: {
                        quantidade: {
                            increment: item.quantidade
                        }
                    }
                });
            }

            await tx.pedidos_produtos.deleteMany({
                where: { pedido_id: id }
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
                        pedido_id: id,
                        produto_id: produto.id,
                        preco: produto.preco,
                        quantidade: item.quantidade
                    }
                });
            }
        }

        const dadosPedido = {};

        if (dados.endereco !== undefined) {
            dadosPedido.endereco = dados.endereco;
        }

        if (dados.cliente_id !== undefined) {
            dadosPedido.cliente_id = dados.cliente_id;
        }

        if (Object.keys(dadosPedido).length > 0) {
            await tx.pedidos.update({
                where: { id },
                data: dadosPedido
            });
        }

        return tx.pedidos.findUnique({
            where: { id },
            include: {
                clientes: {
                    select: {
                        id: true,
                        nome: true,
                        email: true
                    }
                },
                pedidos_produtos: {
                    include: {
                        produtos: true
                    }
                }
            }
        });
    });
}

async function deletar(id) {
    return prisma.$transaction(async (tx) => {
        const pedido = await tx.pedidos.findUnique({
            where: { id },
            include: {
                pedidos_produtos: true
            }
        });

        if (!pedido) {
            throw new NotFoundError("Pedido não encontrado");
        }

        for (const item of pedido.pedidos_produtos) {
            await tx.produtos.update({
                where: { id: item.produto_id },
                data: {
                    quantidade: {
                        increment: item.quantidade
                    }
                }
            });
        }

        await tx.pedidos_produtos.deleteMany({
            where: { pedido_id: id }
        });

        return tx.pedidos.delete({
            where: { id }
        });
    });
}

module.exports = {
    criar,
    buscarPorId,
    listarPorCliente,
    listarTodos,
    atualizar,
    deletar
};
