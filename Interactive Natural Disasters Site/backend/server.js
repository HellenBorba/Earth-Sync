const express = require("express");
const cors = require("cors");
const eventsRouter = require("./routes/events");
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Rotas
app.use("/api/events", eventsRouter);

// CREATE - salvar termo pesquisado
app.post('/api/historico', async (req, res) => {
  const { termo } = req.body;
  try {
    const novo = await prisma.historico.create({ data: { termo } });
    res.json(novo);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// READ - listar histórico
app.get('/api/historico', async (req, res) => {
  try {
    const lista = await prisma.historico.findMany({
      orderBy: { data: 'desc' }
    });
    res.json(lista);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
