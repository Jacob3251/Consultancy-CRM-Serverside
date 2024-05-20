import { Router } from "express";
import LeadController from "../controllers/LeadController.js";

const router = Router();

router.get("/", LeadController.index);
router.post("/", LeadController.create);
router.get("/:id", LeadController.show);
router.put("/:id/update", LeadController.update);
router.delete("/:id/delete", LeadController.delete);

export default router;
