import express from 'express'
import { PrismaClient } from '@prisma/client'

const router = express.Router()
const prisma = new PrismaClient()

// ➕ Salvar pesquisa no histórico
router.post('/search', async (req, res) => {
  try {
    const { term } = req.body
    if (!term || term.trim() === '') {
      return res.status(400).json({ error: 'Termo de pesquisa é obrigatório' })
    }

    const search = await prisma.searchHistory.create({
      data: { term },
    })

    res.status(201).json(search)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erro ao salvar a pesquisa' })
  }
})

// 📋 Obter histórico de pesquisas
router.get('/history', async (req, res) => {
  try {
    const history = await prisma.searchHistory.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20, // limita aos 20 últimos termos
    })

    res.json(history)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erro ao buscar o histórico' })
  }
})

export default router