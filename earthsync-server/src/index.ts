import express from "express";
import cors from "cors";
import historyRoutes from "./routes/history";
import eventsRoutes from "./routes/events";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/history", historyRoutes);
app.use("/api/events", eventsRoutes);

app.listen(5000, () => console.log("✅ Server running on http://localhost:5000"));
