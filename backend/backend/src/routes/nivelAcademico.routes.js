import { Router } from "express";
import {
  getNivelesAcademicos,
  getNivelAcademicoById,
  createNivelAcademico,
  updateNivelAcademico,
  deleteNivelAcademico,
} from "../controllers/nivelAcademico.controller.js";

const router = Router();

router.get("/",     getNivelesAcademicos);
router.get("/:id",  getNivelAcademicoById);
router.post("/",    createNivelAcademico);
router.put("/:id",  updateNivelAcademico);
router.delete("/:id", deleteNivelAcademico);

export default router;
