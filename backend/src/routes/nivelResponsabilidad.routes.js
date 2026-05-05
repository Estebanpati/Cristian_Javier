import { Router } from "express";
import {
  getNivelesResponsabilidad,
  getNivelResponsabilidadById,
  createNivelResponsabilidad,
  updateNivelResponsabilidad,
  deleteNivelResponsabilidad,
} from "../controllers/nivelResponsabilidad.controller.js";

const router = Router();

router.get("/",     getNivelesResponsabilidad);
router.get("/:id",  getNivelResponsabilidadById);
router.post("/",    createNivelResponsabilidad);
router.put("/:id",  updateNivelResponsabilidad);
router.delete("/:id", deleteNivelResponsabilidad);

export default router;
