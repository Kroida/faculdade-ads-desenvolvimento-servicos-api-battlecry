const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function testarBanco() {
    try {
        const categoriaCriada = await prisma.categorias.create({
            data: {
                nome: "teste crud"
            }
        });

        console.log("CREATE");
        console.log(categoriaCriada);

        const categoriaEncontrada = await prisma.categorias.findUnique({
            where: {
                id: categoriaCriada.id
            }
        });

        console.log("\nREAD");
        console.log(categoriaEncontrada);

        const categoriaAtualizada = await prisma.categorias.update({
            where: {
                id: categoriaCriada.id
            },
            data: {
                nome: "Teste CRUD atualizado"
            }
        });

        console.log("\nUPDATE:");
        console.log(categoriaAtualizada);

        const categoriaDeletada = await prisma.categorias.delete({
            where: {
                id: categoriaCriada.id
            }
        })

        console.log("\nDELETE:");
        console.log(categoriaDeletada);

    } catch (error) {
        console.error("Erro durante o teste CRUD:");
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

testarBanco();