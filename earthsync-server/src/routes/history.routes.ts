import express from "express";
import { historyController } from "../controllers/history/history.controller";

const router = express.Router();

router.get("/", historyController.getAll);
router.post("/", historyController.create);
router.delete("/:id", historyController.delete);
router.delete("/", historyController.clearAll);

export default router;
