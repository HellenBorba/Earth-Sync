import { Request, Response } from "express";
import { eventsService } from "../../services/events.service";

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Operations related to events
 */
export const eventsController = {
  /**
   * @swagger
   * /api/events:
   *   get:
   *     summary: List events
   *     description: Returns all available events, optionally filtered by category and date range.
   *     tags: [Events]
   *     parameters:
   *       - in: query
   *         name: category
   *         schema:
   *           type: string
   *         description: Event category (optional)
   *       - in: query
   *         name: start
   *         schema:
   *           type: string
   *           format: date
   *         description: Start date for filter (optional)
   *       - in: query
   *         name: end
   *         schema:
   *           type: string
   *           format: date
   *         description: End date for filter (optional)
   *     responses:
   *       200:
   *         description: List of events returned successfully
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
   *         description: Internal server error
   */
  async getEvents(req: Request, res: Response) {
    try {
      const { category, start, end } = req.query as any;
      const data = await eventsService.fetchEvents({ category, start, end });
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error fetching events" });
    }
  },

  /**
   * @swagger
   * /api/events/{id}:
   *   get:
   *     summary: Get event by ID
   *     description: Returns the details of a specific event.
   *     tags: [Events]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Event ID
   *     responses:
   *       200:
   *         description: Event returned successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Event'
   *       404:
   *         description: Event not found
   *       500:
   *         description: Internal server error
   */
  async getEventById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = await eventsService.fetchEventById(id);
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error fetching event details" });
    }
  },

  /**
   * @swagger
   * /api/events/{id}/images:
   *   get:
   *     summary: List images for an event
   *     description: Returns the images related to a specific event.
   *     tags: [Events]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Event ID
   *     responses:
   *       200:
   *         description: List of images returned successfully
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
   *         description: Internal server error
   */
  async getEventImages(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const images = await eventsService.fetchEventImages(id);
      res.json(images);
    } catch (err) {
      console.error(err);
      // You could also do: res.status(500).json({ error: "Error fetching event images" });
      res.json([]);
    }
  },
};
