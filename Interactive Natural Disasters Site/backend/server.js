const express = require("express");
const cors = require("cors");
const eventsRouter = require("./routes/events");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// Rotas
app.use("/api/events", eventsRouter);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
