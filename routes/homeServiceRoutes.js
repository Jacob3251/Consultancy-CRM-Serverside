import { Router } from "express";
import HomeServiceController from "../controllers/HomeServiceController.js";

const router = Router();
router.get("/", HomeServiceController.index);
router.post("/", HomeServiceController.create);
router.get("/:id", HomeServiceController.show);
router.put("/:id", HomeServiceController.update);
router.delete("/:id", HomeServiceController.delete);

export default router;
