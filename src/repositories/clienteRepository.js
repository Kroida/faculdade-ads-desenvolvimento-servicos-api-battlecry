const prisma = require("../database/prisma");

const clientePublico = {
    id: true,
    nome: true,
    altura: true,
    nascimento: true,
    cidade_id: true,
    email: true,
    tipo: true,
    cidades: true
};

async function criar(cliente) {
    return prisma.clientes.create({
        data: cliente,
        select: clientePublico
    });
}

async function listar() {
    return prisma.clientes.findMany({
        select: clientePublico
    });
}

async function buscarPorId(id) {
    return prisma.clientes.findUnique({
        where: { id },
        select: clientePublico
    });
}

async function buscarCidadePorId(id) {
    return prisma.cidades.findUnique({
        where: { id }
    });
}

// Consulta interna para autenticação. Aqui a senha precisa ser recuperada
// para que o bcrypt consiga comparar o hash salvo com a senha informada.
async function buscarPorEmail(email) {
    return prisma.clientes.findUnique({
        where: { email }
    });
}

async function atualizar(id, dados) {
    return prisma.clientes.update({
        where: { id },
        data: dados,
        select: clientePublico
    });
}

async function deletarComPedidos(id) {
    return prisma.$transaction(async (tx) => {
        const pedidos = await tx.pedidos.findMany({
            where: { cliente_id: id },
            include: {
                pedidos_produtos: true
            }
        });

        // Excluir um cliente também remove seus pedidos. Como a criação do
        // pedido reduz estoque, o estoque é restaurado antes da exclusão.
        for (const pedido of pedidos) {
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
        }

        const pedidoIds = pedidos.map((pedido) => pedido.id);

        if (pedidoIds.length > 0) {
            await tx.pedidos_produtos.deleteMany({
                where: {
                    pedido_id: {
                        in: pedidoIds
                    }
                }
            });

            await tx.pedidos.deleteMany({
                where: {
                    id: {
                        in: pedidoIds
                    }
                }
            });
        }

        return tx.clientes.delete({
            where: { id },
            select: clientePublico
        });
    });
}

module.exports = {
    criar,
    listar,
    buscarPorId,
    buscarCidadePorId,
    buscarPorEmail,
    atualizar,
    deletarComPedidos
};
