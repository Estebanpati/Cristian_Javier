import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middlewares ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Rutas (agregar aquí a medida que se creen) ───────────────
// import personaRoutes         from "./routes/persona.routes.js";
// import bloqueRoutes          from "./routes/bloque.routes.js";
// import nivelAcademicoRoutes  from "./routes/nivelAcademico.routes.js";
// import nivelResponsRoutes    from "./routes/nivelResponsabilidad.routes.js";

// app.use("/api/personas",              personaRoutes);
// app.use("/api/bloques",               bloqueRoutes);
// app.use("/api/niveles-academicos",    nivelAcademicoRoutes);
// app.use("/api/niveles-responsabilidad", nivelResponsRoutes);

// ── Health check ─────────────────────────────────────────────
app.get("/", (_req, res) => {
  res.json({ message: "laburo API funcionando ✅", version: "1.0.0" });
});

// ── Servidor ─────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
