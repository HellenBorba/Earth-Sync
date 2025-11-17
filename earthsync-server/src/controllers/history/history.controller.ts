import { Request, Response } from "express";
import { historyService } from "../../services/history.service";

export const historyController = {

  getAll: async (_: Request, res: Response) => {
    const data = await historyService.getAll();
    res.json(data);
  },

  create: async (req: Request, res: Response) => {
    const { query } = req.body;

    if (!query || typeof query !== "string")
      return res.status(400).json({ error: "Campo 'query' é obrigatório." });

    const newHistory = await historyService.create(query);
    res.status(201).json(newHistory);
  },

  delete: async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    await historyService.delete(id);
    res.sendStatus(204);
  },

  clearAll: async (_: Request, res: Response) => {
    await historyService.clearAll();
    res.sendStatus(204);
  },

  sync: async (req: Request, res: Response) => {
    const { list } = req.body;

    if (!Array.isArray(list))
      return res.status(400).json({ error: "O campo 'list' deve ser um array de objetos { query: string }" });

    for (const item of list) {
      if (item && typeof item.query === "string" && item.query.trim() !== "") {
        await historyService.create(item.query);
      }
    }

    res.status(200).json({ message: "Histórico sincronizado com sucesso." });
  },

};
