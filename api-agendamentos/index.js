const express = require("express");
const prisma = require("./prisma/client");

require("dotenv").config();

const app = express();
app.use(express.json());

const cacheMiddleware = require("./cache");

app.get("/agendamentos", cacheMiddleware("agendamentos"), async (req, res) => {
  const agendamentos = await prisma.agendamento.findMany();
  res.json(agendamentos);
});

app.get(
  "/agendamentos/:id",
  cacheMiddleware("agendamentos"),
  async (req, res) => {
    const { id } = req.params;

    try {
      const agendamento = await prisma.agendamento.findUnique({
        where: { id: parseInt(id, 10) },
      });

      if (!agendamento) {
        return res.status(404).json({ error: "Agendamento não encontrado." });
      }

      res.json(agendamento);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar agendamento." });
    }
  }
);

app.listen(process.env.PORT, () => {
  console.log(`API Agendamentos rodando na porta ${process.env.PORT}`);
});
