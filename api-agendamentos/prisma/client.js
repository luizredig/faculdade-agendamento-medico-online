let prisma;

try {
  const { PrismaClient } = require("@prisma/client");
    prisma = new PrismaClient();
    console.log(prisma);
} catch (e) {
  console.error("Erro ao carregar PrismaClient:", e);
}

module.exports = prisma;
