const express = require("express");
const cors = require("cors");
const { PrismaClient } = require('@prisma/client');

// Importa as rotas apenas uma vez
const eventsRouter = require("./routes/events");
const historyRouter = require("./routes/history");

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Passando o prisma para as rotas (opcional)
app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});

// Rotas
app.use("/api/events", eventsRouter);
app.use("/api/history", historyRouter);

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});
