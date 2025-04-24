require("dotenv").config();
const express = require("express");
const app = express();

app.use(express.json());

const usuarios = [];

app.get("/usuarios", (req, res) => {
  res.json(usuarios);
});

app.post("/usuarios", (req, res) => {
  const { nome, idade, id } = req.body;

  if (!nome || !idade || !id) {
    return res.status(400).json({ error: "Campos obrigatórios ausentes." });
  }

  const novoUsuario = { nome, idade, id };
  usuarios.push(novoUsuario);

  res.status(201).json(novoUsuario);
});

app.listen(process.env.PORT, () => {
  console.log(`API Usuários rodando na porta ${process.env.PORT}`);
});
