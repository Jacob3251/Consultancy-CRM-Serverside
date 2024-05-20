import { Router } from "express";
import ServiceExpertiseController from "../controllers/ServiceExpertiseController.js";

const router = Router();
router.get("/", ServiceExpertiseController.index);
router.post("/", ServiceExpertiseController.create);
router.get("/:id", ServiceExpertiseController.show);
router.put("/:id", ServiceExpertiseController.update);
router.delete("/:id", ServiceExpertiseController.delete);

export default router;
