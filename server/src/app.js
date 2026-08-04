import express from "express";
import cors from "cors";

const app = express();

// Which browser origins may call this API. Comes from .env in production;
// defaults cover the two local dev servers (admin :5173, public site :5174).
const allowedOrigins = (
  process.env.CORS_ORIGINS || "http://localhost:5173,http://localhost:5174"
).split(",");
app.use(cors({ origin: allowedOrigins }));

// Parse JSON request bodies into req.body
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

export default app;