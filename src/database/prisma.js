const { PrismaClient } = require("@prisma/client");

// Uma única instância do PrismaClient é reutilizada por toda a aplicação.
// Isso evita abrir vários pools de conexão desnecessariamente.
const prisma = new PrismaClient();

module.exports = prisma;
