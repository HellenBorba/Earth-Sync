import { Router } from "express";
import { historyController } from "../controllers/history/history.controller";

const router = Router();

router.get("/", historyController.getAll);

router.post("/", historyController.create);

router.post("/sync", historyController.sync);

router.delete("/clear", historyController.clearAll);

router.delete("/:id", historyController.delete);

export default router;
