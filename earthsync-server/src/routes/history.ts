import { Router } from "express";
import { historyController } from "../controllers/history/history.controller";

const router = Router();

router.get("/", historyController.getAll);

// Criar um único termo
router.post("/", historyController.create);

// Sincronizar vários termos (query)
router.post("/sync", historyController.sync);

router.delete("/clear", historyController.clearAll);

router.delete("/:id", historyController.delete);

export default router;
