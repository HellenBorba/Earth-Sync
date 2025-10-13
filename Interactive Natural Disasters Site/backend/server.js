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
  } catch (err) {console.error(err);
    res.status(500).json({ erro: err.message });
  }
});

// READ - listar histórico
app.get('/api/historico', async (req, res) => {
  try {
    const historico = await prisma.historico.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(historico);
  } catch (err) {console.error(err);
    res.status(500).json({ erro: err.message });
  }
});

// Atualizar termo (opcional)
app.put("/api/historico/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { termo } = req.body;
    const atualizado = await prisma.historico.update({
      where: { id: parseInt(id) },
      data: { termo },
    });
    res.json(atualizado);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// Deletar termo
app.delete("/api/historico/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.historico.delete({
      where: { id: parseInt(id) },
    });
    res.json({ mensagem: "Registro deletado com sucesso" });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
