import { Request, Response } from "express";
import { eventsService } from "../../services/events.service";

export const eventsController = {
  async getEvents(req: Request, res: Response) {
    try {
      const { category, start, end } = req.query as any;
      const data = await eventsService.fetchEvents({ category, start, end });
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao buscar eventos" });
    }
  },

  async getEventById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = await eventsService.fetchEventById(id);
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao buscar detalhes do evento" });
    }
  },

  async getEventImages(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const images = await eventsService.fetchEventImages(id);
      res.json(images);
    } catch (err) {
      console.error(err);
      res.json([]);
    }
  },
};
