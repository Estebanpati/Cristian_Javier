import { Router } from "express";
import {
  getPersonas,
  getPersonaById,
  createPersona,
  updatePersona,
  deletePersona,
} from "../controllers/persona.controller.js";

const router = Router();

router.get("/",     getPersonas);
router.get("/:id",  getPersonaById);
router.post("/",    createPersona);
router.put("/:id",  updatePersona);
router.delete("/:id", deletePersona);

export default router;
