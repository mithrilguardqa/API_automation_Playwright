import express from "express";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import fs from "node:fs";
import path from "node:path";
import { setStore } from "./data/store.js";
import { seedStore } from "./data/seed.js";
import { requireAuth } from "./middleware/auth.js";
import authRoutes from "./routes/auth.js";
import usersRoutes from "./routes/users.js";
import carsRoutes from "./routes/cars.js";
import tracksRoutes from "./routes/tracks.js";
import recordsRoutes from "./routes/records.js";
import resetRoutes from "./routes/reset.js";

const app = express();
const PORT = process.env.PORT ?? 3000;
const PID_FILE = path.join(process.cwd(), ".server.pid");

// Seed in-memory store on startup
setStore(seedStore());

app.use(express.json());
app.use(cookieParser());

// API docs (Swagger UI) – open http://localhost:3000/docs in browser
const openapiPath = path.join(process.cwd(), "openapi.json");
const openapi = JSON.parse(fs.readFileSync(openapiPath, "utf8"));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapi));

// Public routes (no auth)
app.use("/", authRoutes);
app.use("/reset", resetRoutes);

// Protected API routes
app.use("/users", requireAuth, usersRoutes);
app.use("/cars", requireAuth, carsRoutes);
app.use("/tracks", requireAuth, tracksRoutes);
app.use("/records", requireAuth, recordsRoutes);

// 404
app.use((_req, res) => {
  res.status(404).json({ error: "Not Found", message: "Endpoint not found" });
});

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error", message: "An unexpected error occurred" });
});

const server = app.listen(PORT, () => {
  fs.writeFileSync(PID_FILE, String(process.pid), "utf8");
  console.log(`Racing API server running at http://localhost:${PORT}`);
});

function shutdown(): void {
  try {
    fs.unlinkSync(PID_FILE);
  } catch {
    // ignore
  }
  server.close(() => process.exit(0));
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
