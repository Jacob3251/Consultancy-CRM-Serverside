import { Router } from "express";
import RoleController from "../controllers/RoleController.js";
const router = Router();

router.get("/", RoleController.index);
router.post("/", RoleController.create);
router.get("/:id", RoleController.show);
router.put("/:id", RoleController.update);
router.delete("/:id", RoleController.delete);

export default router;
