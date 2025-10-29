import express from "express";
import cors from "cors";
import eventsRouter from "./routes/events";  // apontando para events.ts
import historyRouter from "./routes/history"; // apontando para history.ts
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Opcional: passar prisma para todas as rotas
declare global {
  namespace Express {
    interface Request {
      prisma?: PrismaClient;
    }
  }
}

app.use((req, _res, next) => {
  req.prisma = prisma;
  next();
});

// Rotas
app.use("/api/events", eventsRouter);
app.use("/api/history", historyRouter);

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});
