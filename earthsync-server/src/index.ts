import express from "express";
import cors from "cors";
import historyRoutes from "./routes/history.routes";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/history", historyRoutes);
<<<<<<< Updated upstream
=======
app.use("/api/events", eventsRoutes);
>>>>>>> Stashed changes

app.listen(5000, () => console.log("✅ Server running on http://localhost:5000"));
