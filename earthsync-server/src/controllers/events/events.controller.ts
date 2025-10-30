import { Request, Response } from "express";
import { eventsService } from "../../services/events.service";

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Operações relacionadas a eventos
 */
export const eventsController = {
  /**
   * @swagger
   * /api/events:
   *   get:
   *     summary: Lista eventos
   *     description: Retorna todos os eventos disponíveis, podendo filtrar por categoria e intervalo de datas.
   *     tags: [Events]
   *     parameters:
   *       - in: query
   *         name: category
   *         schema:
   *           type: string
   *         description: Categoria do evento (opcional)
   *       - in: query
   *         name: start
   *         schema:
   *           type: string
   *           format: date
   *         description: Data inicial do filtro (opcional)
   *       - in: query
   *         name: end
   *         schema:
   *           type: string
   *           format: date
   *         description: Data final do filtro (opcional)
   *     responses:
   *       200:
   *         description: Lista de eventos retornada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 events:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Event'
   *       500:
   *         description: Erro interno no servidor
   */
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

  /**
   * @swagger
   * /api/events/{id}:
   *   get:
   *     summary: Busca evento por ID
   *     description: Retorna os detalhes de um evento específico.
   *     tags: [Events]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID do evento
   *     responses:
   *       200:
   *         description: Evento retornado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Event'
   *       404:
   *         description: Evento não encontrado
   *       500:
   *         description: Erro interno no servidor
   */
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

  /**
   * @swagger
   * /api/events/{id}/images:
   *   get:
   *     summary: Lista imagens de um evento
   *     description: Retorna as imagens relacionadas a um evento específico.
   *     tags: [Events]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID do evento
   *     responses:
   *       200:
   *         description: Lista de imagens retornada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: string
   *                     example: "gibs-evt_123"
   *                   url:
   *                     type: string
   *                     example: "https://gibs.earthdata.nasa.gov/..."
   *                   title:
   *                     type: string
   *                     example: "NASA GIBS - True Color"
   *                   date:
   *                     type: string
   *                     format: date
   *                     example: "2025-10-30"
   *                   type:
   *                     type: string
   *                     example: "RGB"
   *                   source:
   *                     type: string
   *                     example: "NASA GIBS"
   *       500:
   *         description: Erro interno no servidor
   */
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
