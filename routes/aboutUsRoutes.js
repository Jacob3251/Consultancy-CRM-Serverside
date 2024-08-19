import { Router } from "express";
import AboutUsController from "../controllers/AboutUsController.js";

const router = Router();
router.get("/", AboutUsController.index);
router.post("/", AboutUsController.update);

export default router;
