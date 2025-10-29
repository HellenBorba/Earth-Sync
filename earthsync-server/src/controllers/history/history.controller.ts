import { Request, Response } from "express";
import { historyService } from "../../services/history.service";



export const historyController = {
  getAll: async (req: Request, res: Response) => {
    const data = await historyService.getAll();
    res.json(data);
  },

  create: async (req: Request, res: Response) => {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: "Campo 'query' é obrigatório" });
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
};
