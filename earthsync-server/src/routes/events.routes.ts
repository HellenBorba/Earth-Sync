import express from "express";
import { eventsController } from "../controllers/events/events.controller";

const router = express.Router();

router.get("/", eventsController.getEvents);
router.get("/:id", eventsController.getEventById);
router.get("/:id/images", eventsController.getEventImages);

export default router;