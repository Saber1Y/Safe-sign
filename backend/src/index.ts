import cors from "cors";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "qie-safesign-backend" });
});

app.post("/explain", (req, res) => {
  const { action = "unknown", risk = "Medium" } = req.body ?? {};
  res.json({
    explanation: `This transaction action is ${String(action)} with ${String(risk)} risk based on current rule hints.`,
    fallback: true,
  });
});

app.listen(port, () => {
  console.log(`QIE SafeSign backend listening on port ${port}`);
});
