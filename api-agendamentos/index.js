const express = require("express");
const prisma = require("./prisma/client");
const hospitais = require("./hospitais");
const axios = require("axios");

const API_MEDICOS_URL = process.env.API_MEDICOS_URL;
const API_USUARIOS_URL = process.env.API_USUARIOS_URL;

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

app.post("/agendamentos", async (req, res) => {
  const idMedico = Math.floor(Math.random() * 5) + 1;
  const idUsuario = Math.floor(Math.random() * 5) + 1;
  const hospital = hospitais[Math.floor(Math.random() * hospitais.length)];

  try {
    const medicoResponse = await axios.get(
      `${API_MEDICOS_URL}/medicos/${idMedico}`
    );
    const medico = medicoResponse.data;

    const usuarioResponse = await axios.get(
      `${API_USUARIOS_URL}/usuarios/${idUsuario}`
    );
    const usuario = usuarioResponse.data;

    const novoAgendamento = await prisma.agendamento.create({
      data: {
        idUsuario: usuario.id,
        idMedico: medico.id,
        local: hospital.nome,
      },
    });

    res.status(201).json(novoAgendamento);
  } catch (error) {
    console.error("Erro ao criar agendamento:", error.message);
    res.status(500).json({ error: "Erro ao criar agendamento." });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`API Agendamentos rodando na porta ${process.env.PORT}`);
});
