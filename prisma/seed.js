const prisma = require("../src/database/prisma");

async function main() {
    let cidade = await prisma.cidades.findFirst({
        where: { nome: "Porto Alegre" }
    });

    if (!cidade) {
        cidade = await prisma.cidades.create({
            data: { nome: "Porto Alegre" }
        });
    }

    let categoria = await prisma.categorias.findFirst({
        where: { nome: "Geral" }
    });

    if (!categoria) {
        categoria = await prisma.categorias.create({
            data: { nome: "Geral" }
        });
    }

    console.log("Seed concluído:");
    console.log(`Cidade: ${cidade.id} - ${cidade.nome}`);
    console.log(`Categoria: ${categoria.id} - ${categoria.nome}`);
}

main()
    .catch((error) => {
        console.error("Erro ao executar seed:", error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
