import express from "express";
import cors from "cors";
import { setupSwagger } from "./config/swagger";
import eventsRouter from "./routes/events";
import historyRouter from "./routes/history";
import { prisma } from "./prismaClient"; 

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

declare global {
  namespace Express {
    interface Request {
      prisma?: typeof prisma;
    }
  }
}

app.use((req, _res, next) => {
  req.prisma = prisma; 
  next();
});

// Routes
app.use("/api/events", eventsRouter);
app.use("/api/history", historyRouter);

// Swagger
setupSwagger(app);

// Server start
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📘 Swagger disponível em http://localhost:${PORT}/api-docs`);
});
