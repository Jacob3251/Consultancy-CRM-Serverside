import { Router } from "express";
import PermissionController from "../controllers/PermissionController.js";

const router = Router();
router.get("/", PermissionController.index);
router.post("/", PermissionController.create);
router.get("/:id", PermissionController.show);
router.put("/:id", PermissionController.update);
router.delete("/:id", PermissionController.delete);

export default router;
