import { Request, Response } from "express";
import { historyService } from "../../services/history.service";

/**
 * @swagger
 * tags:
 *   name: History
 *   description: Operações relacionadas ao histórico de consultas
 */
export const historyController = {
  /**
   * @swagger
   * /api/history:
   *   get:
   *     summary: Lista todo o histórico
   *     description: Retorna todos os registros de histórico de consultas.
   *     tags: [History]
   *     responses:
   *       200:
   *         description: Lista de histórico retornada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/History'
   *       500:
   *         description: Erro interno no servidor
   */
  getAll: async (_: Request, res: Response) => {
    const data = await historyService.getAll();
    res.json(data);
  },

  /**
   * @swagger
   * /api/history:
   *   post:
   *     summary: Cria um novo registro de histórico
   *     description: Adiciona um novo item no histórico de consultas.
   *     tags: [History]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               query:
   *                 type: string
   *                 description: Consulta realizada
   *                 example: "Terremotos no Brasil"
   *     responses:
   *       201:
   *         description: Registro criado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/History'
   *       400:
   *         description: Campo obrigatório ausente
   *       500:
   *         description: Erro interno no servidor
   */
  create: async (req: Request, res: Response) => {
    const { query } = req.body;
    if (!query)
      return res.status(400).json({ error: "Campo 'query' é obrigatório" });

    const newHistory = await historyService.create(query);
    res.status(201).json(newHistory);
  },

  /**
   * @swagger
   * /api/history/{id}:
   *   delete:
   *     summary: Deleta um registro do histórico
   *     description: Remove um item do histórico pelo ID.
   *     tags: [History]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID do registro
   *     responses:
   *       204:
   *         description: Registro deletado com sucesso (sem conteúdo)
   *       404:
   *         description: Registro não encontrado
   *       500:
   *         description: Erro interno no servidor
   */
  delete: async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    await historyService.delete(id);
    res.sendStatus(204);
  },

  /**
   * @swagger
   * /api/history/clear:
   *   delete:
   *     summary: Limpa todo o histórico
   *     description: Remove todos os registros do histórico de consultas.
   *     tags: [History]
   *     responses:
   *       204:
   *         description: Histórico limpo com sucesso (sem conteúdo)
   *       500:
   *         description: Erro interno no servidor
   */
  clearAll: async (_: Request, res: Response) => {
    await historyService.clearAll();
    res.sendStatus(204);
  },
};
