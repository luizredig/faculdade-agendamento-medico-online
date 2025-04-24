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

app.get("/usuarios/:id", async (req, res) => {
  const { id } = req.params;
  const cacheKey = `usuarios:${id}`;

  try {
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const usuario = usuarios.find((u) => u.id === parseInt(id, 10));
    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    await redisClient.setEx(cacheKey, 60, JSON.stringify(usuario));
    res.json(usuario);
  } catch (err) {
    console.error("Erro na busca por ID com cache:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
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
