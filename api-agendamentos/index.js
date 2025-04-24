const express = require("express");
const prisma = require("./prisma/client");

require("dotenv").config();

const app = express();
app.use(express.json());

app.get("/agendamentos", async (req, res) => {
  const agendamentos = await prisma.agendamento.findMany();
  res.json(agendamentos);
});

app.post("/agendamentos", async (req, res) => {
  const { idUsuario, idMedico, local } = req.body;

  if (!idUsuario || !idMedico || !local) {
    return res.status(400).json({ error: "Campos obrigatórios ausentes." });
  }

  try {
    const novoAgendamento = await prisma.agendamento.create({
      data: { idUsuario, idMedico, local },
    });

    res.status(201).json(novoAgendamento);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar agendamento." });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`API Agendamentos rodando na porta ${process.env.PORT}`);
});
