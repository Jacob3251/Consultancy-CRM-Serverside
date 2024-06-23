import { Router } from "express";
import progressController from "../controllers/ProgressController.js";

const router = Router();

router.get("/", progressController.index);
router.post("/", progressController.create);
router.get("/:id", progressController.show);
router.put("/:id", progressController.update);
router.delete("/:id", progressController.delete);

export default router;
