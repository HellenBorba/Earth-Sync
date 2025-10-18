import express from "express";
import cors from "cors";
import historyRoutes from "./routes/history.routes";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/history", historyRoutes);

app.listen(8080, () => console.log("✅ Server running on http://localhost:8080"));
