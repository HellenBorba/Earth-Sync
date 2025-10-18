const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");

// Cria a instância do Prisma
const prisma = new PrismaClient();

/**
 * GET /api/history
 * Lista todo o histórico de pesquisas
 */
router.get("/", async (req, res) => {
  try {
    const history = await prisma.searchHistory.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(history);
  } catch (err) {
    console.error("Erro ao buscar histórico:", err);
    res.status(500).json({ error: "Erro ao buscar histórico" });
  }
});

/**
 * POST /api/history
 * Cria um novo item no histórico
 */
router.post("/", async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || !query.trim()) {
      return res.status(400).json({ error: "Campo 'query' é obrigatório" });
    }

    const newItem = await prisma.searchHistory.create({
      data: { query },
    });

    res.status(201).json(newItem);
  } catch (err) {
    console.error("Erro ao criar histórico:", err);
    res.status(500).json({ error: "Erro ao criar histórico" });
  }
});

/**
 * DELETE /api/history/:id
 * Remove um item específico do histórico
 */
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    await prisma.searchHistory.delete({ where: { id } });
    res.sendStatus(204);
  } catch (err) {
    console.error("Erro ao excluir histórico:", err);
    res.status(500).json({ error: "Erro ao excluir histórico" });
  }
});

/**
 * DELETE /api/history
 * Limpa todo o histórico
 */
router.delete("/", async (req, res) => {
  try {
    await prisma.searchHistory.deleteMany();
    res.sendStatus(204);
  } catch (err) {
    console.error("Erro ao limpar histórico:", err);
    res.status(500).json({ error: "Erro ao limpar histórico" });
  }
});

module.exports = router;
