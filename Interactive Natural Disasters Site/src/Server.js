import express from 'express'
import { PrismaClient } from '@prisma/client'
import searchRoutes from './routes/searchRoutes.js'

const app = express()
const prisma = new PrismaClient()
const PORT = 3000

app.use(express.json())

// Rotas
app.use('/api', searchRoutes)

// Inicializa o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`)
})