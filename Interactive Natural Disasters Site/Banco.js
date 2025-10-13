const express = require('express');
const { PrismaClient } = require('@prisma/client');
const app = express();
const prisma = new PrismaClient();
const PORT = 3001;

app.use(express.json());

// CREATE - Adiciona termo ao histórico
app.post('/historico', async (req, res) => {
  const { termo } = req.body;
  try {
    const novo = await prisma.historico.create({ data: { termo } });
    res.json(novo);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// READ - Lista histórico
app.get('/historico', async (req, res) => {
  try {
    const lista = await prisma.historico.findMany({ orderBy: { data: 'desc' } });
    res.json(lista);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// UPDATE - Atualiza termo do histórico
app.put('/historico/:id', async (req, res) => {
  const { termo } = req.body;
  try {
    const atualizado = await prisma.historico.update({
      where: { id: Number(req.params.id) },
      data: { termo }
    });
    res.json(atualizado);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// DELETE - Remove termo do histórico
app.delete('/historico/:id', async (req, res) => {
  try {
    await prisma.historico.delete({ where: { id: Number(req.params.id) } });
    res.json({ removido: true });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});