require("dotenv").config();
const express = require("express");
const cacheMiddleware = require("./cache");

const app = express();
app.use(express.json());

const usuarios = [
  { nome: "Lucas", idade: 25, id: 1 },
  { nome: "Ana", idade: 30, id: 2 },
  { nome: "Carlos", idade: 28, id: 3 },
  { nome: "Maria", idade: 22, id: 4 },
  { nome: "João", idade: 35, id: 5 },
];

app.get("/usuarios", cacheMiddleware("usuarios"), (req, res) => {
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
