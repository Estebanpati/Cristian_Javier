import { Router } from "express";
import {
  getBloques,
  getBloqueById,
  createBloque,
  updateBloque,
  deleteBloque,
} from "../controllers/bloque.controller.js";

const router = Router();

router.get("/",     getBloques);
router.get("/:id",  getBloqueById);
router.post("/",    createBloque);
router.put("/:id",  updateBloque);
router.delete("/:id", deleteBloque);

export default router;
