import express from "express";
import { historyService } from "../services/history.service";
import { historyController } from "../controllers/history/history.controller";

const router = express.Router();

router.get("/", async (req, res) => {
  const all = await historyService.getAll();
  res.json(all);
});

router.post("/", async (req, res) => {
  try {
    const { terms } = req.body;

    if (!Array.isArray(terms)) {
      return res.status(400).json({ error: "O campo 'terms' deve ser um array" });
    }

    await historyService.sync(terms);
    res.status(200).json({ message: "Histórico sincronizado com sucesso!" });
  } catch (error) {
    console.error("Erro ao sincronizar histórico:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);

  if(isNaN(id)) {
    return res.status(400).json({ error: "ID inválido" });
  }
    try {
        await historyService.delete(id);
        res.status(200).json({ message: "Item deletado com sucesso" });
    } catch (error) {
        console.error("Erro ao deletar item do histórico:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
  }
});


export default router;
